package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Dto.CandidateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.OrgVerificationStatus;
import com.ToFact.Verification.Service.CandidateService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/org/candidates")
@RequiredArgsConstructor
public class CandidateController {

	private final CandidateService service;
	private final JwtUtil jwtUtil;

	// 🔹 Extract orgId (COMMON METHOD)
	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String orgId = claims.get("orgId", String.class);

		if (orgId == null) {
			throw new RuntimeException("Invalid token: orgId missing");
		}

		return orgId;
	}

	// 🔹 CREATE
	@PostMapping("/createCandidate")
	public Candidate create(@RequestBody CandidateDTO dto, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		if (orgId == null) {
			throw new RuntimeException("Invalid token: orgId missing");
		}
		System.out.println("created");
		return service.create(dto, orgId); // 🔥 PASS orgId
	}

	// 🔹 GET ALL (FILTERED BY orgId 🔥)
	@GetMapping("/getAllCandidates")
	public List<Candidate> getAll(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return service.getByOrgId(orgId);
	}

	// 🔹 GET BY ID (SECURED)
	@GetMapping("/getCandidateDetailsById/{id}")
	public Candidate getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.getById(id, orgId);
	}

	// 🔹 UPDATE (SECURED)
	@PutMapping("/editCandidateDetails/{id}")
	public Candidate update(@PathVariable Long id, @RequestBody CandidateDTO dto,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.update(id, dto, orgId);
	}

	// 🔹 DELETE (SECURED)
	@DeleteMapping("/deleteCandidate/{id}")
	public String delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		service.delete(id, orgId);
		return "Deleted";
	}

	// 🔹 STATUS UPDATE
	@PutMapping("/{id}/status")
	public Candidate updateStatus(@PathVariable Long id, @RequestParam OrgVerificationStatus status,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.updateStatus(id, status, orgId);
	}

	@GetMapping("/search")
	public List<Candidate> searchCandidates(@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction, @RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);

		return service.searchCandidates(orgId, q, sortBy, direction);
	}

}