package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Pharmacist;
import com.project_crud.service.PharmacistService;

@RestController
@CrossOrigin("http://localhost:3000")
public class PharmacistController {

    @Autowired
    private PharmacistService service;

    // Add Pharmacist
    @PostMapping("/addPharmacist")
    public Pharmacist addPharmacist(@RequestBody Pharmacist pharmacist) {
        return service.addPharmacist(pharmacist);
    }

    // View Pharmacists
    @GetMapping("/viewPharmacists")
    public List<Pharmacist> viewPharmacists() {
        return service.viewPharmacists();
    }

    // Delete Pharmacist
    @DeleteMapping("/deletePharmacist/{id}")
    public String deletePharmacist(@PathVariable int id) {
        return service.deletePharmacist(id);
    }
}