package com.project_crud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project_crud.model.Bill;
import com.project_crud.service.BillService;

@RestController
@CrossOrigin("http://localhost:3000")
public class BillController {

    @Autowired
    private BillService service;

    // Add Bill
    @PostMapping("/addBill")
    public Bill addBill(@RequestBody Bill bill) {
        return service.addBill(bill);
    }

    // View Bills
    @GetMapping("/viewBills")
    public List<Bill> viewBills() {
        return service.viewBills();
    }

    // Delete Bill
    @DeleteMapping("/deleteBill/{id}")
    public String deleteBill(@PathVariable int id) {
        return service.deleteBill(id);
    }
}