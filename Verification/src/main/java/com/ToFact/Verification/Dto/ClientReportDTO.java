package com.ToFact.Verification.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ClientReportDTO {
	private String organizationName;
	private Long count;
	
	public ClientReportDTO(String organizationName, Long count) {
        this.organizationName = organizationName;
        this.count = count;
    }

}