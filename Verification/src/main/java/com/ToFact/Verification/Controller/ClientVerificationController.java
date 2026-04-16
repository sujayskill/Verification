package com.ToFact.Verification.Controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Service.VerificationService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org/verifications")
@RequiredArgsConstructor
public class ClientVerificationController {

	private final VerificationService service;
	private final JwtUtil jwtUtil;

	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String orgId = claims.get("orgId", String.class);

		if (orgId == null) {
			throw new RuntimeException("Invalid token");
		}

		return orgId;
	}

	// 🔹 CREATE BGV
	@PostMapping("/{candidateId}")
	public Verification create(@PathVariable Long candidateId, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.create(candidateId, orgId);
	}

	// 🔹 PLATFORM VIEW
	@GetMapping("/platform")
	public List<Verification> getAll() {
		return service.getAll();
	}
	
	@GetMapping("/exists/{candidateId}")
	public boolean exists(@PathVariable Long candidateId) {
	    return service.exists(candidateId);
	}
	
	@PutMapping("/{id}/status")
	public Verification updateStatus(@PathVariable Long id,
	                                @RequestParam VerificationStatus status) {
	    return service.updateStatus(id, status);
	}
	
	@GetMapping("/org")
	public List<Verification> getByOrg(@RequestHeader("Authorization") String authHeader) {

	    String token = authHeader.substring(7);
	    Claims claims = jwtUtil.extractClaims(token);

	    String orgId = claims.get("orgId", String.class);

	    return service.getByOrg(orgId);
	}
	
	@GetMapping("/download/{id}")
	public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {

	    Verification v = service.getById(id);

	    Path path = Paths.get(v.getReportUrl());

	    Resource resource = new UrlResource(path.toUri());

	    return ResponseEntity.ok()
	            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.txt")
	            .body(resource);
	}
}