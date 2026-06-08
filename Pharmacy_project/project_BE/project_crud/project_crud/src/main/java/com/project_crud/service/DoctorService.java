package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Doctor;

public interface DoctorService {

    // Add Doctor
    public Doctor addDoctor(Doctor doctor);

    // View Doctors
    public List<Doctor> viewDoctors();

    // Delete Doctor
    public String deleteDoctor(int id);
}