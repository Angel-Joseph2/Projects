package com.project_crud.service;

import java.util.List;

import com.project_crud.model.Bill;

public interface BillService {

    // Add Bill
    public Bill addBill(Bill bill);

    // View Bills
    public List<Bill> viewBills();

    // Delete Bill
    public String deleteBill(int id);
}