package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Medicine;
import com.project_crud.repository.MedicineRepository;

@Service
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepository repo;

    @Override
    public Medicine addMedicine(Medicine medicine) {
        return repo.save(medicine);
    }

    @Override
    public List<Medicine> viewMedicines() {
        return repo.findAll();
    }

    @Override
    public String deleteMedicine(int id) {
        repo.deleteById(id);
        return "Medicine Deleted Successfully";
    }

    @Override
    public Medicine updateMedicine(int id, Medicine medicine) {

        Medicine oldMedicine = repo.findById(id).orElse(null);

        oldMedicine.setMedicineName(medicine.getMedicineName());
        oldMedicine.setPrice(medicine.getPrice());
        oldMedicine.setQuantity(medicine.getQuantity());

        return repo.save(oldMedicine);
    }
}