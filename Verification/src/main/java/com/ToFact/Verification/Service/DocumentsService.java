package com.ToFact.Verification.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.DocumentType;
import com.ToFact.Verification.Entity.Documents;
import com.ToFact.Verification.Entity.Education;
import com.ToFact.Verification.Entity.Experience;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.DocumentsRepository;
import com.ToFact.Verification.Repository.EducationRepository;
import com.ToFact.Verification.Repository.ExperienceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentsService {

	private final DocumentsRepository repo;
	private final CandidateRepository candidateRepo;
	private final EducationRepository educationRepo;
	private final ExperienceRepository experienceRepo;

	public Documents upload(Long candidateId, MultipartFile file, String type, String orgId, Long educationId,
			Long experienceId) throws IOException {

		Candidate candidate = candidateRepo.findById(candidateId)
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		if (!candidate.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		Documents doc = new Documents();

		doc.setId(null); // 🔥 IMPORTANT (force insert)
		doc.setFileName(file.getOriginalFilename());
		doc.setFileType(parseType(type));
		doc.setContentType(file.getContentType());
		doc.setData(file.getBytes());
		doc.setUploadedAt(LocalDateTime.now());
		doc.setCandidate(candidate);

// 🔥 EDUCATION LINK
		if (educationId != null) {
			Education edu = educationRepo.findById(educationId).orElseThrow();
			doc.setEducation(edu);
		}

// 🔥 EXPERIENCE LINK
		if (experienceId != null) {
			Experience exp = experienceRepo.findById(experienceId).orElseThrow();
			doc.setExperience(exp);
		}

		System.out.println("Saving new doc for candidate: " + candidateId);
		System.out.println("DOC ID BEFORE SAVE: " + doc.getId());

		return repo.save(doc);
	}

	// 🔥 GET DOCUMENTS (SECURED)
	public List<Documents> getByCandidate(Long candidateId, String orgId) {

		Candidate candidate = candidateRepo.findById(candidateId)
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		if (!candidate.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		return repo.findByCandidateId(candidateId);
	}

	private DocumentType parseType(String type) {
		try {
			return DocumentType.valueOf(type.toUpperCase());
		} catch (Exception e) {
			throw new RuntimeException("Invalid document type: " + type);
		}
	}
}