package com.ToFact.Verification.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Dto.VerificationUpdateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Documents;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.DocumentsRepository;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.VendorActivityService;
import com.ToFact.Verification.Service.VerificationService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/platform/verifications")
@RequiredArgsConstructor
public class VendorVerificationController {

	private final VerificationService service;
	private final VendorActivityService reportService;
	private final CandidateRepository candidateRepo;
	private final DocumentsRepository documentsRepository;
	private final JwtUtil jwtUtil;

//	extracting pay-load from JWT
	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String orgId = claims.get("orgId", String.class);

		if (orgId == null) {
			throw new RuntimeException("Invalid token");
		}

		return orgId;
	}

	// 🔹 GET ALL (FOR PLATFORM)
	@GetMapping
	public List<Verification> getAll() {
		return service.getAll();
	}

	// 🔥 GET SINGLE VERIFICATION WITH FULL DETAILS
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

//	@GetMapping("/platform/{id}")
//	public Verification getById(@PathVariable Long id) {
//	    return service.getById(id);
//	}

//	Verification Status  
	@GetMapping("/summary")
	public Map<String, Map<String, Long>> getSummary() {
		return service.getStatusSummary();
	}

//	Saving verification data from verifier validation data
	@PutMapping("/{id}/verify")
	public Verification updateVerification(@PathVariable Long id, @RequestBody VerificationUpdateDTO dto) {

		return service.saveVerificationData(id, dto);
	}

//	Functionality for verification rollback approval 
	@PutMapping("/{id}/approve-rollback")
	public Verification approveRollback(@PathVariable Long id) {
		return service.approveClientRollbackRequest(id);
	}


	// 🔹 ALL CLIENTS (grouping purpose)
	@GetMapping("/reports/clients")
	public List<Verification> getClients() {
		return reportService.getAll();
	}

	// 🔹 COMPLETED REPORTS ONLY
	@GetMapping("/reports/{orgId}")
	public List<Verification> getCompletedReports(@PathVariable String orgId) {
		System.out.println("call " + orgId);
		return reportService.getCompletedByOrg(orgId);
	}

//	Verification clients list search
	@GetMapping("/clients")
	public Page<Map<String, Object>> getClients(@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
		Pageable pageable = PageRequest.of(page, size);
		System.out.println("controller check");
		return reportService.getClientsGrouped(q, pageable);
	}
	
//	Verification candidates list
	@GetMapping("/search/candidates")
	public List<Verification> searchCandidates(@RequestParam String orgId, @RequestParam(required = false) String q) {
		return reportService.searchCandidates(orgId, q);
	}
	
	// 🔹 ADD COMMENT
//		@PutMapping("/{id}/comment")
//		public Verification addComment(@PathVariable Long id, @RequestParam String comment) {
//			return service.addComment(id, comment);
//		}
//
//		// 🔹 UPLOAD DOCUMENT
//		@PostMapping("/{id}/upload")
//		public Verification upload(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
//
//			String uploadDir = "uploads/";
//			String filePath = uploadDir + file.getOriginalFilename();
//
//			Files.copy(file.getInputStream(), Paths.get(filePath));
//
//			return service.uploadDocument(id, filePath);
//		}

}