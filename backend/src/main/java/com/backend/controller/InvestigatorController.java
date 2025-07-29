package com.backend.controller;

import com.backend.model.Investigator;
import com.backend.service.InvestigatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investigators")
public class InvestigatorController {
    private final InvestigatorService service;

    public InvestigatorController(InvestigatorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Investigator> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Investigator> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Investigator create(@RequestBody Investigator investigator) {
        return service.save(investigator);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Investigator> update(@PathVariable Long id, @RequestBody Investigator investigator) {
        return service.findById(id)
                .map(existing -> {
                    investigator.setId(id);
                    return ResponseEntity.ok(service.save(investigator));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}