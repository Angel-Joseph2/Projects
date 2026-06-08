package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Doctor;
import com.project_crud.repository.DoctorRepository;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository repo;

    // Add Doctor
    @Override
    public Doctor addDoctor(Doctor doctor) {
        return repo.save(doctor);
    }

    // View Doctors
    @Override
    public List<Doctor> viewDoctors() {
        return repo.findAll();
    }

    // Delete Doctor
    @Override
    public String deleteDoctor(int id) {
        repo.deleteById(id);
        return "Doctor Deleted Successfully";
    }
}