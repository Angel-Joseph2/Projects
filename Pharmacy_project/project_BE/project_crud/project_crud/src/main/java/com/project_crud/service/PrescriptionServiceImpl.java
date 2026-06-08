package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Prescription;
import com.project_crud.repository.PrescriptionRepository;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository repo;

    // Add Prescription
    @Override
    public Prescription addPrescription(Prescription prescription) {
        return repo.save(prescription);
    }

    // View Prescriptions
    @Override
    public List<Prescription> viewPrescriptions() {
        return repo.findAll();
    }

    // Delete Prescription
    @Override
    public String deletePrescription(int id) {
        repo.deleteById(id);
        return "Prescription Deleted Successfully";
    }
}