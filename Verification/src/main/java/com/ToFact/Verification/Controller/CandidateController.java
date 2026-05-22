<<<<<<< HEAD
package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.security.core.Authentication;
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

import com.ToFact.Verification.Dto.CandidateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.CandidateService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/org/candidates")
@RequiredArgsConstructor
public class CandidateController {

	private final CandidateService candidateService;
	private final CandidateRepository candidateRepo;
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
		return candidateService.create(dto, orgId); // 🔥 PASS orgId
	}

	// 🔹 GET ALL (FILTERED BY orgId 🔥)
	@GetMapping("/getAllCandidates")
	public List<Candidate> getAll(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return candidateService.getByOrgId(orgId);
	}

	// 🔹 GET BY ID (SECURED)
	@GetMapping("/getCandidateDetailsById/{id}")
	public Candidate getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.getById(id, orgId);
	}

	// 🔹 UPDATE (SECURED)
	@PutMapping("/editCandidateDetails/{id}")
	public Candidate update(@PathVariable Long id, @RequestBody CandidateDTO dto,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.update(id, dto, orgId);
	}

	// 🔹 DELETE (SECURED)
	@DeleteMapping("/deleteCandidate/{id}")
	public String delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		candidateService.delete(id, orgId);
		return "Deleted";
	}

	// 🔹 STATUS UPDATE
	@PutMapping("/{id}/status")
	public Candidate updateStatus(@PathVariable Long id, @RequestParam ClientVerificationStatus status,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.updateStatus(id, status, orgId);
	}

	@GetMapping("/search")
	public List<Candidate> searchCandidates(@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction, @RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);

		return candidateService.searchCandidates(orgId, q, sortBy, direction);
	}

	@GetMapping("/verifications")
	public List<Candidate> getVerificationCandidates(@RequestParam(required = false) String q,
			@RequestParam(required = false) ClientVerificationStatus status,
			@RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);
		return candidateService.searchVerificationCandidates(orgId, q, status);
	}

	@GetMapping("/by-department/{deptId}")
	public List<Candidate> getByDepartment(@PathVariable Long deptId, @RequestHeader("Authorization") String auth) {
		String orgId = extractOrgId(auth);
		return candidateService.getByDepartment(orgId, deptId);
	}

	@GetMapping("/by_department/{deptId}")
	public List<Candidate> getCandidatesForVerification(@PathVariable Long deptId,
			@RequestParam(required = false, defaultValue = "") String q) {
		return candidateRepo.findByDepartmentIdAndSearch(deptId, q);
	}

//	This method is for search functionality in Candidates page in Candidates section in Client portal
//	Search with Email, Location, Phone, Number, Role
	@GetMapping("/getFullDetailsBy-department/{deptId}")
	public List<Candidate> getCandidates(@PathVariable Long deptId, @RequestParam(required = false) String q,
			@RequestParam(required = false) ClientVerificationStatus status) {
		return candidateService.getCandidates(deptId, q, status);
	}

}

//	@GetMapping("/by-department")
//	public List<Candidate> getCandidates(
//	        @RequestParam String orgId,
//	        @RequestParam Long deptId,
//	        @RequestParam(required = false) String q
//	) {
//	    return candidateService.getCandidatesByDept(orgId, deptId, q);
=======
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
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Service.CandidateService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/org/candidates")
@RequiredArgsConstructor
public class CandidateController {

	private final CandidateService candidateService;
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
		return candidateService.create(dto, orgId); // 🔥 PASS orgId
	}

	// 🔹 GET ALL (FILTERED BY orgId 🔥)
	@GetMapping("/getAllCandidates")
	public List<Candidate> getAll(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return candidateService.getByOrgId(orgId);
	}

	// 🔹 GET BY ID (SECURED)
	@GetMapping("/getCandidateDetailsById/{id}")
	public Candidate getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.getById(id, orgId);
	}

	// 🔹 UPDATE (SECURED)
	@PutMapping("/editCandidateDetails/{id}")
	public Candidate update(@PathVariable Long id, @RequestBody CandidateDTO dto,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.update(id, dto, orgId);
	}

	// 🔹 DELETE (SECURED)
	@DeleteMapping("/deleteCandidate/{id}")
	public String delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		candidateService.delete(id, orgId);
		return "Deleted";
	}

	// 🔹 STATUS UPDATE
	@PutMapping("/{id}/status")
	public Candidate updateStatus(@PathVariable Long id, @RequestParam ClientVerificationStatus status,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return candidateService.updateStatus(id, status, orgId);
	}

	@GetMapping("/search")
	public List<Candidate> searchCandidates(@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction, @RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);

		return candidateService.searchCandidates(orgId, q, sortBy, direction);
	}

	@GetMapping("/by-department/{deptId}")
	public List<Candidate> getByDepartment(@PathVariable Long deptId, @RequestHeader("Authorization") String auth) {
		String orgId = extractOrgId(auth);
		return candidateService.getByDepartment(orgId, deptId);
	}
	

}
//	@GetMapping("/by-department")
//	public List<Candidate> getCandidates(
//	        @RequestParam String orgId,
//	        @RequestParam Long deptId,
//	        @RequestParam(required = false) String q
//	) {
//	    return candidateService.getCandidatesByDept(orgId, deptId, q);
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
//	}