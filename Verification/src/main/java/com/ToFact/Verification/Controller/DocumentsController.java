package com.ToFact.Verification.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Entity.Documents;
import com.ToFact.Verification.Repository.DocumentsRepository;
import com.ToFact.Verification.Service.DocumentsService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentsController {

	private final DocumentsService service;
	private final JwtUtil jwtUtil;
	private final DocumentsRepository repo;

	// 🔐 EXTRACT ORG FROM TOKEN
	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String orgId = claims.get("orgId", String.class);

		if (orgId == null) {
			throw new RuntimeException("Invalid token");
		}

		return orgId;
	}

	// 🔥 UPLOAD DOCUMENT
//	@PreAuthorize("hasRole('CLIENT')")
	@PostMapping("/upload/{candidateId}")
	public Documents upload(@PathVariable Long candidateId, @RequestParam("file") MultipartFile file,
			@RequestParam("type") String type, @RequestParam(value = "educationId", required = false) Long educationId,
			@RequestParam(value = "experienceId", required = false) Long experienceId,
			@RequestHeader("Authorization") String authHeader) throws IOException {

		String orgId = extractOrgId(authHeader);

		System.out.println("upload contorller");
		return service.upload(candidateId, file, type, orgId, educationId, experienceId);
		
	}

	// 🔥 GET DOCUMENTS
	@GetMapping("/{candidateId}")
	public List<Documents> getDocs(@PathVariable Long candidateId, @RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);
		return service.getByCandidate(candidateId, orgId);
	}

	@GetMapping("/download/{id}")
	public ResponseEntity<byte[]> download(@PathVariable Long id) {

		Documents doc = repo.findById(id).orElseThrow();

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
				.contentType(MediaType.parseMediaType(doc.getContentType())).body(doc.getData());
	}

	@GetMapping("/preview/{id}")
	public ResponseEntity<byte[]> preview(@PathVariable Long id) {

		Documents doc = repo.findById(id).orElseThrow();

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(doc.getContentType())).body(doc.getData());
	}
}