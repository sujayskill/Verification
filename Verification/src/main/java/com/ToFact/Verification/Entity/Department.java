package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
<<<<<<< HEAD
    private String name;
    private String orgId; // 🔥 link to client
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client;
=======

    private String name;

    private String orgId; // 🔥 link to client
    
    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client;

    private LocalDateTime createdAt = LocalDateTime.now();
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}
