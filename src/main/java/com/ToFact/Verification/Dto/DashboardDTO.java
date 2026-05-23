package com.ToFact.Verification.Dto;

import lombok.Data;

@Data
public class DashboardDTO {
	private long totalClients;
	private long activeClients;
	private long totalVerifications;
	private long inProgress;
	private long completed;
}
