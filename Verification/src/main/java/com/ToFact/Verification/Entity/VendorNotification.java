package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class VendorNotification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String orgId;

	private Long verificationId;
	
	private Long departmentId; 

	private boolean isRead = false;

	private LocalDateTime createdAt = LocalDateTime.now();
}