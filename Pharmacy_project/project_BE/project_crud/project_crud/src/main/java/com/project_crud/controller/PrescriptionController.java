package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Prescription;
import com.project_crud.service.PrescriptionService;

@RestController
@CrossOrigin("http://localhost:3000")
public class PrescriptionController {

    @Autowired
    private PrescriptionService service;

    // Add Prescription
    @PostMapping("/addPrescription")
    public Prescription addPrescription(@RequestBody Prescription prescription) {
        return service.addPrescription(prescription);
    }

    // View Prescriptions
    @GetMapping("/viewPrescriptions")
    public List<Prescription> viewPrescriptions() {
        return service.viewPrescriptions();
    }

    // Delete Prescription
    @DeleteMapping("/deletePrescription/{id}")
    public String deletePrescription(@PathVariable int id) {
        return service.deletePrescription(id);
    }
}