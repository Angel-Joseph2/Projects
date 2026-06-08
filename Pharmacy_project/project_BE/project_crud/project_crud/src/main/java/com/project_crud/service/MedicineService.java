package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Medicine;

public interface MedicineService {

    // Add Medicine
    public Medicine addMedicine(Medicine medicine);

    // View Medicines
    public List<Medicine> viewMedicines();

    // Delete Medicine
    public String deleteMedicine(int id);

    // Update Medicine
    public Medicine updateMedicine(int id, Medicine medicine);
}