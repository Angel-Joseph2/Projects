package com.project_crud.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project_crud.model.Bill;
import com.project_crud.repository.BillRepository;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository repo;

    // Add Bill
    @Override
    public Bill addBill(Bill bill) {
        return repo.save(bill);
    }

    // View Bills
    @Override
    public List<Bill> viewBills() {
        return repo.findAll();
    }

    // Delete Bill
    @Override
    public String deleteBill(int id) {
        repo.deleteById(id);
        return "Bill Deleted Successfully";
    }
}