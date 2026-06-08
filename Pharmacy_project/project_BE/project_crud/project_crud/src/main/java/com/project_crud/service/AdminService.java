package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Admin;

public interface AdminService {

    // Add Admin
    public Admin addAdmin(Admin admin);

    // View Admins
    public List<Admin> viewAdmins();

    // Delete Admin
    public String deleteAdmin(int id);
}