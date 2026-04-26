package com.ToFact.Verification.Dto;

import java.util.List;

import lombok.Data;

@Data
public class VerificationUpdateDTO {

	private String basicCheckStatus;
	private String addressStatus;

	private List<CheckDTO> educationChecks;
	private List<CheckDTO> experienceChecks;

	private String finalRemarks;
	private String riskLevel;
}
