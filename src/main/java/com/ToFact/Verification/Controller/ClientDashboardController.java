package com.ToFact.Verification.Controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.ClientDashboardService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clientDashboard")
@RequiredArgsConstructor
public class ClientDashboardController {
	
	private final JwtUtil jwtUtil;
	private final ClientDashboardService clientDashboardService;

	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String orgId = claims.get("orgId", String.class);

		if (orgId == null) {
			throw new RuntimeException("Invalid token: orgId missing");
		}

		return orgId;
	}

	@GetMapping("/")
	public Map<String, Object> getClientDashboard(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return clientDashboardService.getClientDashboard(orgId);
	}

}
