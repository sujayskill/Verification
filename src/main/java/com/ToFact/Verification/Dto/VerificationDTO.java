package com.ToFact.Verification.Dto;

import java.time.LocalDateTime;

import com.ToFact.Verification.Entity.VerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerificationDTO {

    private Long id;
    private String candidateName;
    private VerificationStatus status;
    private boolean reportAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime slaDeadline;
}