package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Pharmacist;

public interface PharmacistService {

    // Add Pharmacist
    public Pharmacist addPharmacist(Pharmacist pharmacist);

    // View Pharmacists
    public List<Pharmacist> viewPharmacists();

    // Delete Pharmacist
    public String deletePharmacist(int id);
}