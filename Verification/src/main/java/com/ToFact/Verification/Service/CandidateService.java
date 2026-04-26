package com.ToFact.Verification.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.CandidateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.OrgVerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

	private final CandidateRepository repo;
	private final ClientRepository clientRepo;

	private static final Logger log = LoggerFactory.getLogger(CandidateService.class);

	// 🔹 CREATE
	public Candidate create(CandidateDTO dto, String orgId) {

		Client client = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Client not found"));

		Candidate c = new Candidate();

		// 🔹 BASIC
		c.setFirstName(dto.getFirstName());
		c.setLastName(dto.getLastName());
		c.setEmail(dto.getEmail());
		c.setPhone(dto.getPhone());

		c.setStatus(OrgVerificationStatus.CREATED);

		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());

		// 🔥 EDUCATIONS (MULTIPLE)
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(c)); // 🔥 IMPORTANT
			c.setEducations(dto.getEducations());
		}

		// 🔥 EXPERIENCES (MULTIPLE)
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(exp -> exp.setCandidate(c)); // 🔥 IMPORTANT
			c.setExperiences(dto.getExperiences());
		}

		// 🔥 CLIENT LINK
		c.setClient(client);

		return repo.save(c);
	}

	// 🔹 GET ALL
	public List<Candidate> getByOrgId(String orgId) {
		System.out.println("FETCHING FOR ORG: " + orgId); // 🔥

		List<Candidate> list = repo.findByClient_OrgId(orgId);

		System.out.println("CANDIDATES FOUND: " + list.size());
		return list;
	}

	// 🔹 GET BY ID
	public Candidate getById(Long id, String orgId) {

		Candidate c = repo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}
		System.out.println(c.getEducations().size());

		return c;
	}

	// 🔹 UPDATE
	public Candidate update(Long id, CandidateDTO dto, String orgId) {

		Candidate existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔐 SECURITY CHECK (IMPORTANT)
		if (!existing.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		// 🔹 BASIC DETAILS
		existing.setFirstName(dto.getFirstName());
		existing.setLastName(dto.getLastName());
		existing.setEmail(dto.getEmail());
		existing.setPhone(dto.getPhone());
		existing.setDob(dto.getDob());

		// 🔹 ADDRESS
		existing.setCurrentAddress(dto.getCurrentAddress());
		existing.setPermanentAddress(dto.getPermanentAddress());

		// 🔥 EDUCATION
		existing.getEducations().clear();
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(existing));
			existing.getEducations().addAll(dto.getEducations());
		}

		// 🔥 EXPERIENCE
		existing.getExperiences().clear();
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(e -> e.setCandidate(existing));
			existing.getExperiences().addAll(dto.getExperiences());
		}

		return repo.save(existing);
	}

	// 🔹 DELETE
	public void delete(Long id, String orgId) {
		Candidate c = getById(id, orgId);

		if (c.isLocked()) {
			throw new RuntimeException("Candidate is under verification and cannot be modified");
		}
		repo.delete(c);
	}

	// 🔹 STATUS UPDATE
	public Candidate updateStatus(Long id, OrgVerificationStatus status, String orgId) {

		Candidate c = getById(id, orgId);
		c.setStatus(status);
		return repo.save(c);
	}

	public List<Candidate> searchCandidates(String orgId, String query, String sortBy, String direction) {

		Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

		if (query == null || query.isBlank()) {
			return repo.findByClient_OrgId(orgId, sort);
		}

		return repo.searchCandidates(orgId, query, sort);
	}
}