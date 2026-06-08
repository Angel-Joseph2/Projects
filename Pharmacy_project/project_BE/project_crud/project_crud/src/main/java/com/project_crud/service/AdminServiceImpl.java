package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Admin;
import com.project_crud.repository.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository repo;

    // Add Admin
    @Override
    public Admin addAdmin(Admin admin) {
        return repo.save(admin);
    }

    // View Admins
    @Override
    public List<Admin> viewAdmins() {
        return repo.findAll();
    }

    // Delete Admin
    @Override
    public String deleteAdmin(int id) {
        repo.deleteById(id);
        return "Admin Deleted Successfully";
    }
}