package com.ToFact.Verification.Dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
	
	private String accessToken;
	private String refreshToken;
	private String username;
	private String role;
	private String orgId;
	
}