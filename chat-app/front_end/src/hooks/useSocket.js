import { useEffect } from 'react';
import socket from '../services/socket';

const useSocket = (user) => {
  useEffect(() => {
    if (user) {
      // Connect socket if user is logged in
      socket.connect();
      // Potentially emit a user_connected event here if the backend expects it,
      // or the backend might handle it on connection.
    } else {
      // Disconnect if user logs out
      socket.disconnect();
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  return socket;
};

export default useSocket;
