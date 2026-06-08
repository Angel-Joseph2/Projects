package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Prescription;

public interface PrescriptionService {

    // Add Prescription
    public Prescription addPrescription(Prescription prescription);

    // View Prescriptions
    public List<Prescription> viewPrescriptions();

    // Delete Prescription
    public String deletePrescription(int id);
}