package com.ToFact.Verification.Controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ToFact.Verification.ClientManagement.Entity.Candidate;
import com.ToFact.Verification.ClientManagement.Entity.Documents;
import com.ToFact.Verification.ClientManagement.Repository.CandidateRepository;
import com.ToFact.Verification.ClientManagement.Repository.DocumentsRepository;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/platform/verifications")
@RequiredArgsConstructor
public class VendorVerificationController {

	private final VerificationService service;
	private final CandidateRepository candidateRepo;
	private final DocumentsRepository documentsRepository;

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

	// 🔹 ADD COMMENT
	@PutMapping("/{id}/comment")
	public Verification addComment(@PathVariable Long id, @RequestParam String comment) {
		return service.addComment(id, comment);
	}

	// 🔹 UPLOAD DOCUMENT
	@PostMapping("/{id}/upload")
	public Verification upload(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {

		String uploadDir = "uploads/";
		String filePath = uploadDir + file.getOriginalFilename();

		Files.copy(file.getInputStream(), Paths.get(filePath));

		return service.uploadDocument(id, filePath);
	}

//	Verification Status  
	@GetMapping("/summary")
	public Map<String, Map<String, Long>> getSummary() {
		return service.getStatusSummary();
	}

}