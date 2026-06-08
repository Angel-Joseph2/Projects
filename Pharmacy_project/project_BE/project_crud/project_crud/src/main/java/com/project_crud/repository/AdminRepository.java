package com.project_crud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project_crud.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

}