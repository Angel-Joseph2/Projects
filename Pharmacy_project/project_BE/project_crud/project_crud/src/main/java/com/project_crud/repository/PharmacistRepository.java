package com.project_crud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project_crud.model.Pharmacist;

@Repository
public interface PharmacistRepository extends JpaRepository<Pharmacist, Integer> {

}