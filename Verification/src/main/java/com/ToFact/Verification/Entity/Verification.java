package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
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

	private String candidateEmail;

	private String comment;

	private String documentUrl;

	private Boolean viewedByVendor = false;

	@Column(name = "created_at", nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime createdAt;

	private LocalDateTime slaDeadline;

	private Boolean slaBreached = false;

	private String reportUrl;

	@Column(columnDefinition = "TEXT")
	private String reportData; // JSON string

	private String finalRemarks;
	private String riskLevel;

	@Enumerated(EnumType.STRING)
	private VerificationStatus status;

	private boolean rollbackRequested = false;
}