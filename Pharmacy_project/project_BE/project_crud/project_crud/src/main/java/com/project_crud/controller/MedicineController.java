package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Medicine;
import com.project_crud.service.MedicineService;

@RestController
@CrossOrigin("http://localhost:3000")
public class MedicineController {

    @Autowired
    private MedicineService service;

    @PostMapping("/addMedicine")
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return service.addMedicine(medicine);
    }

    @GetMapping("/viewMedicine")
    public List<Medicine> viewMedicines() {
        return service.viewMedicines();
    }

    @DeleteMapping("/deleteMedicine/{id}")
    public String deleteMedicine(@PathVariable int id) {
        return service.deleteMedicine(id);
    }

    @PutMapping("/updateMedicine/{id}")
    public Medicine updateMedicine(@PathVariable int id,
                                   @RequestBody Medicine medicine) {

        return service.updateMedicine(id, medicine);
    }
}