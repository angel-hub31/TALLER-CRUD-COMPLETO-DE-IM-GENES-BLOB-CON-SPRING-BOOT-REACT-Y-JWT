package com.krakedev.taller_jwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.krakedev.taller_jwt.entidades.Celular;


public interface CelularRepository extends JpaRepository<Celular, Integer> {
}