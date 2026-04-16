package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Data
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long candidateId;

    private String orgId; // 🔥 CHANGED
    private String organizationName;

    private String candidateName;

    @Enumerated(EnumType.STRING)
    private VerificationStatus status;
    
    private String comment;

    private String documentUrl;

    private Boolean viewedByVendor = false;

    private LocalDateTime createdAt;
    
    private LocalDateTime slaDeadline;
    
    private Boolean slaBreached = false;
    
    private String reportUrl;
}