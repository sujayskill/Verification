package com.ToFact.Verification.Controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.ToFact.Verification.Dto.ClientReportDTO;
import com.ToFact.Verification.Dto.VerificationDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Documents;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.DocumentsRepository;
import com.ToFact.Verification.Service.VerificationsReportsService;
import com.ToFact.Verification.Service.VerificationService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org/verifications")
@RequiredArgsConstructor
public class ClientVerificationController {

	private final VerificationService service;
	private final VerificationsReportsService reportService;
	private final JwtUtil jwtUtil;
	private final CandidateRepository candidateRepo;
	private final DocumentsRepository documentsRepository;

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

	@GetMapping("/candidateReports")
	public List<VerificationDTO> getMyReports(@RequestHeader("Authorization") String authHeader,
			@RequestParam(required = false) String q) {

		String orgId = extractOrgId(authHeader);

		return reportService.getCompletedReports(orgId, q);
	}

	// 🔹 PLATFORM VIEW
	@GetMapping("/my-reports")
	public List<VerificationDTO> getMyReports(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return service.getByOrgDTO(orgId);
	}

//	It fetch the report by candidate
	@GetMapping("/{id}")
	public Map<String, Object> getDetails(@PathVariable Long id) {

		Verification v = service.getById(id);

		Candidate c = candidateRepo.findById(v.getCandidateId())
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔥 FETCH DOCUMENTS
		List<Documents> docs = documentsRepository.findByCandidateId(c.getId());

		Map<String, Object> response = new HashMap<>();
		response.put("verification", v);
		response.put("candidate", c);
		response.put("documents", docs); // ✅ ADD THIS
		System.out.println(docs.size());

		return response;
	}

	@GetMapping("/exists/{candidateId}")
	public boolean exists(@PathVariable Long candidateId) {
		return service.exists(candidateId);
	}

	@PutMapping("/{id}/status")
	public Verification updateStatus(@PathVariable Long id, @RequestParam VerificationStatus status) {
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

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.txt")
				.body(resource);
	}

// verification roll-back request
	@PutMapping("/{id}/request-rollback")
	public Verification requestRollback(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return service.requestRollback(id, orgId);
	}

//	It gives candidate wise details
	@GetMapping("/by-candidate/{candidateId}")
	public Verification getByCandidate(@PathVariable Long candidateId,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		return service.getByCandidate(candidateId, orgId);
	}

//	This method is for implementing search functionality in verification page in client module 
	@GetMapping("/search")
	public Page<Verification> search(@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size,
			@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);

		Pageable pageable = PageRequest.of(page, size);

		return service.searchVerifications(orgId, q, pageable);
	}

//	// CLIENT LIST
//	@GetMapping("/reports/clients")
//	public Page<ClientReportDTO> getClients(@RequestParam(required = false) String q,
//			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
//		Pageable pageable = PageRequest.of(page, size);
//		return reportsService.getClientReports(q, pageable);
//	}
//
//	// CANDIDATES LIST
//	@GetMapping("/reports/candidates")
//	public Page<Verification> getCandidates(@RequestParam String org, @RequestParam(required = false) String q,
//			@RequestParam(defaultValue = "0") int page) {
//		return reportsService.getCompletedCandidates(org, q, PageRequest.of(page, 6));
//	}

//	It gives candidate wise details
//	@GetMapping("/candidate/{candidateId}")
//	public Verification getByCandidate(@PathVariable Long candidateId,
//	                                   @RequestHeader("Authorization") String authHeader) {
//
//	    String orgId = extractOrgId(authHeader);
//
//	    Verification v = service.getByCandidate(candidateId);
//
//	    if (!v.getOrgId().equals(orgId)) {
//	        throw new RuntimeException("Unauthorized");
//	    }
//
//	    return v;
//	}  	

}