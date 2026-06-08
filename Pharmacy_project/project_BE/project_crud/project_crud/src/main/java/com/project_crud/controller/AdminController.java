package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Admin;
import com.project_crud.service.AdminService;

@RestController
@CrossOrigin("http://localhost:3000")
public class AdminController {

	@Autowired
	private AdminService service;

    // Add Admin
    @PostMapping("/addAdmin")
    public Admin addAdmin(@RequestBody Admin admin) {
        return service.addAdmin(admin);
    }

    // View Admins
    @GetMapping("/viewAdmins")
    public List<Admin> viewAdmins() {
        return service.viewAdmins();
    }

    // Delete Admin
    @DeleteMapping("/deleteAdmin/{id}")
    public String deleteAdmin(@PathVariable int id) {
        return service.deleteAdmin(id);
    }
}