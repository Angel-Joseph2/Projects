package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Doctor;
import com.project_crud.service.DoctorService;

@RestController
@CrossOrigin("http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService service;

    // Add Doctor
    @PostMapping("/addDoctor")
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return service.addDoctor(doctor);
    }

    // View Doctors
    @GetMapping("/viewDoctors")
    public List<Doctor> viewDoctors() {
        return service.viewDoctors();
    }

    // Delete Doctor
    @DeleteMapping("/deleteDoctor/{id}")
    public String deleteDoctor(@PathVariable int id) {
        return service.deleteDoctor(id);
    }
}