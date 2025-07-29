package com.backend.service;

import com.backend.model.Investigator;
import com.backend.repository.InvestigatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvestigatorService {
    private final InvestigatorRepository repository;

    public InvestigatorService(InvestigatorRepository repository) {
        this.repository = repository;
    }

    public List<Investigator> findAll() {
        return repository.findAll();
    }

    public Optional<Investigator> findById(Long id) {
        return repository.findById(id);
    }

    public Investigator save(Investigator investigator) {
        return repository.save(investigator);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}