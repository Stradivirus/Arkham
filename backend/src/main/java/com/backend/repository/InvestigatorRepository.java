package com.backend.repository;

import com.backend.model.Investigator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestigatorRepository extends JpaRepository<Investigator, Long> {
}