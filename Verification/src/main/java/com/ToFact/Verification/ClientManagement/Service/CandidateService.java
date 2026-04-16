package com.ToFact.Verification.ClientManagement.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.ClientManagement.DTO.CandidateDTO;
import com.ToFact.Verification.ClientManagement.Entity.Candidate;
import com.ToFact.Verification.ClientManagement.Entity.OrgVerificationStatus;
import com.ToFact.Verification.ClientManagement.Repository.CandidateRepository;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

	private final CandidateRepository repo;
	private final ClientRepository clientRepo;

	// 🔹 CREATE
	public Candidate create(CandidateDTO dto, String orgId) {

		Client client = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Client not found"));

		Candidate c = new Candidate();

		// 🔹 BASIC
		c.setFirstName(dto.getFirstName());
		c.setLastName(dto.getLastName());
		c.setEmail(dto.getEmail());
		c.setPhone(dto.getPhone());

		c.setStatus(OrgVerificationStatus.INITIATED);

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

		Candidate c = getById(id, orgId);

		// 🔹 BASIC
		c.setFirstName(dto.getFirstName());
		c.setLastName(dto.getLastName());
		c.setEmail(dto.getEmail());
		c.setPhone(dto.getPhone());

		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());

		// 🔥 EDUCATION UPDATE (REPLACE OLD)
		if (dto.getEducations() != null) {
			c.getEducations().clear(); // 🔥 remove old

			dto.getEducations().forEach(e -> {
				e.setCandidate(c); // 🔥 re-map
				c.getEducations().add(e);
			});
		}

		// 🔥 EXPERIENCE UPDATE (REPLACE OLD)
		if (dto.getExperiences() != null) {
			c.getExperiences().clear();

			dto.getExperiences().forEach(exp -> {
				exp.setCandidate(c);
				c.getExperiences().add(exp);
			});
		}

		return repo.save(c);
	}

	// 🔹 DELETE
	public void delete(Long id, String orgId) {
		Candidate c = getById(id, orgId);
		repo.delete(c);
	}

	// 🔹 STATUS UPDATE
	public Candidate updateStatus(Long id, OrgVerificationStatus status, String orgId) {

		Candidate c = getById(id, orgId);
		c.setStatus(status);

		return repo.save(c);
	}
}