const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const connectDB = require("./db");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

let db;

// Existing socket.io server instance
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Maintain a map of userId -> socket.id (using rooms for easy targeting)
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Expect client to emit 'join' with their userId after authentication
    socket.on("join", (userId) => {
        if (userId) {
            // Join a room named after the userId so we can target messages directly
            socket.join(String(userId));
            console.log(`User ${userId} joined room`);
        }
    });

    // Handle real‑time message sending
    socket.on("send_message", async (data, callback) => {
        const { sender_id, recipient_id, text_content } = data;
        try {
            // Save message to DB
            await db.run(
                `INSERT INTO messages (sender_id, recipient_id, text_content, is_read)
                 VALUES (?, ?, ?, 0)`,
                [sender_id, recipient_id, text_content]
            );
            // Build the message object to emit back (including timestamp)
            const message = {
                sender_id,
                recipient_id,
                text_content,
                is_read: 0,
                created_at: new Date().toISOString()
            };
            // Emit to recipient (if online) and also to sender for immediate UI update
            io.to(String(recipient_id)).emit("receive_message", message);
            socket.emit("receive_message", message); // sender receives instantly

            // Calculate updated unread count for the recipient from this sender
            const row = await db.get(
                `SELECT COUNT(*) as cnt FROM messages WHERE sender_id = ? AND recipient_id = ? AND is_read = 0`,
                [sender_id, recipient_id]
            );
            const unreadCount = row.cnt;
            // Notify recipient of the new unread count
            io.to(String(recipient_id)).emit("unread_count_updated", {
                sender_id,
                recipient_id,
                unread_count: unreadCount
            });
            if (callback) callback({ status: "ok" });
        } catch (err) {
            console.error("Error handling send_message", err);
            if (callback) callback({ status: "error", error: err.message });
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// ------------------------------------------------------------------
// New API: Get unread message counts for a user
app.get("/api/messages/unread/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const rows = await db.all(
            `SELECT sender_id, COUNT(*) as cnt FROM messages 
             WHERE recipient_id = ? AND is_read = 0 
             GROUP BY sender_id`,
            [userId]
        );
        const result = {};
        rows.forEach(r => {
            result[r.sender_id] = r.cnt;
        });
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
});

// New API: Mark messages from a specific sender as read for a recipient
app.put("/api/messages/read/:senderId/:recipientId", async (req, res) => {
    const { senderId, recipientId } = req.params;
    try {
        await db.run(
            `UPDATE messages SET is_read = 1 
             WHERE sender_id = ? AND recipient_id = ? AND is_read = 0`,
            [senderId, recipientId]
        );
        res.json({ message: "Messages marked as read" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
});

// ------------------------------------------------------------------
// Existing routes remain unchanged (login, register, user list, fetch messages, send via HTTP)
// Ensure the existing POST /api/messages/send continues to work for non‑socket callers
// It already inserts the message; we add an optional emission if needed
app.post("/api/messages/send", async (req, res) => {
    const { sender_id, recipient_id, text_content } = req.body;
    try {
        await db.run(
            `INSERT INTO messages (sender_id, recipient_id, text_content, is_read)
             VALUES (?, ?, ?, 0)`,
            [sender_id, recipient_id, text_content]
        );
        // Emit through socket if recipient is online
        const message = {
            sender_id,
            recipient_id,
            text_content,
            is_read: 0,
            created_at: new Date().toISOString()
        };
        io.to(String(recipient_id)).emit("receive_message", message);
        // Update unread count for recipient
        const row = await db.get(
            `SELECT COUNT(*) as cnt FROM messages WHERE sender_id = ? AND recipient_id = ? AND is_read = 0`,
            [sender_id, recipient_id]
        );
        io.to(String(recipient_id)).emit("unread_count_updated", {
            sender_id,
            recipient_id,
            unread_count: row.cnt
        });
        res.json({ message: "Message Sent Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

/* stray CORS config removed */

// Register API
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users(username,email,password) VALUES(?,?,?)",
      [username, email, hashedPassword]
    );

    res.json({
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Login API
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    res.json({
      message: "Login Successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/api/users/:id", async (req, res) => {

  const id = req.params.id;

  try {

    const users = await db.all(
      "SELECT id, username, email FROM users WHERE id != ?",
      [id]
    );

    res.json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }

});

app.get("/api/messages/:senderId/:receiverId", async (req, res) => {

    const { senderId, receiverId } = req.params;

    try {

        const messages = await db.all(
            `
            SELECT *
            FROM messages
            WHERE
            (sender_id = ? AND recipient_id = ?)
            OR
            (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at ASC
            `,
            [senderId, receiverId, receiverId, senderId]
        );

        res.json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

app.post("/api/messages/send", async (req, res) => {

    const { sender_id, recipient_id, text_content } = req.body;

    try {

        await db.run(
            `
            INSERT INTO messages
            (sender_id, recipient_id, text_content)
            VALUES (?, ?, ?)
            `,
            [sender_id, recipient_id, text_content]
        );

        res.json({
            message: "Message Sent Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

app.patch("/api/messages/:senderId/read", async (req, res) => {

    const senderId = req.params.senderId;
    const { recipientId } = req.body;

    try {

        await db.run(
            `
            UPDATE messages
            SET is_read = 1
            WHERE sender_id = ?
            AND recipient_id = ?
            AND is_read = 0
            `,
            [senderId, recipientId]
        );

        res.json({
            message: "Messages marked as read"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });

});

app.post('/api/messages', (req, res) => {
    const { sender_id, recipient_id, text_content } = req.body;

    if (!sender_id || !recipient_id || !text_content) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    const sql = `
        INSERT INTO messages
        (sender_id, recipient_id, text_content)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [sender_id, recipient_id, text_content],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Failed to send message'
                });
            }

            res.json({
                message: 'Message sent',
                id: this.lastID
            });
        }
    );
});

// Start Server
async function startServer() {
  db = await connectDB();

  server.listen(5000, () => {
    console.log("Server running on port 5000");
});
}

startServer();