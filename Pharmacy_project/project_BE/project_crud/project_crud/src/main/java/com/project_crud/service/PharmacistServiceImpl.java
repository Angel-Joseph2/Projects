package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Pharmacist;
import com.project_crud.repository.PharmacistRepository;

@Service
public class PharmacistServiceImpl implements PharmacistService {

    @Autowired
    private PharmacistRepository repo;

    // Add Pharmacist
    @Override
    public Pharmacist addPharmacist(Pharmacist pharmacist) {
        return repo.save(pharmacist);
    }

    // View Pharmacists
    @Override
    public List<Pharmacist> viewPharmacists() {
        return repo.findAll();
    }

    // Delete Pharmacist
    @Override
    public String deletePharmacist(int id) {
        repo.deleteById(id);
        return "Pharmacist Deleted Successfully";
    }
}