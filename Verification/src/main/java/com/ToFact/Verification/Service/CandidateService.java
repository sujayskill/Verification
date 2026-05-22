<<<<<<< HEAD
package com.ToFact.Verification.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.CandidateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Entity.Department;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

	private final CandidateRepository candidateRepo;
	private final ClientRepository clientRepo;
	private final DepartmentRepository departmentRepo;

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
		c.setStatus(ClientVerificationStatus.CREATED);
		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());
		// 🔥 EDUCATIONS
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(c));
			c.setEducations(dto.getEducations());
		}
		// 🔥 EXPERIENCES
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(exp -> exp.setCandidate(c));
			c.setExperiences(dto.getExperiences());
		}
		// 🔥 CLIENT LINK
		c.setClient(client);
		// 🔥🔥🔥 IMPORTANT PART (NEW)
		if (dto.getDepartmentId() != null) {
			Department dept = departmentRepo.findById(dto.getDepartmentId())
					.orElseThrow(() -> new RuntimeException("Department not found"));
			// 🔐 SECURITY CHECK
			if (!dept.getOrgId().equals(orgId)) {
				throw new RuntimeException("Unauthorized department access");
			}
			c.setDepartment(dept);
		}
		return candidateRepo.save(c);
	}

	// 🔹 GET ALL
	public List<Candidate> getByOrgId(String orgId) {
		System.out.println("FETCHING FOR ORG: " + orgId); // 🔥

		List<Candidate> list = candidateRepo.findByClient_OrgId(orgId);

		System.out.println("CANDIDATES FOUND: " + list.size());
		return list;
	}

	// 🔹 GET BY ID
	public Candidate getById(Long id, String orgId) {

		Candidate c = candidateRepo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}
		System.out.println(c.getEducations().size());

		return c;
	}

	// 🔹 UPDATE
	public Candidate update(Long id, CandidateDTO dto, String orgId) {

		Candidate existing = candidateRepo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

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

		return candidateRepo.save(existing);
	}

	// 🔹 DELETE
	public void delete(Long id, String orgId) {
		Candidate c = getById(id, orgId);

		if (c.isLocked()) {
			throw new RuntimeException("Candidate is under verification and cannot be modified");
		}
		candidateRepo.delete(c);
	}

	// 🔹 STATUS UPDATE
	public Candidate updateStatus(Long id, ClientVerificationStatus status, String orgId) {

		Candidate c = getById(id, orgId);
		c.setStatus(status);
		return candidateRepo.save(c);
	}

	public List<Candidate> searchVerificationCandidates(String orgId, String q, ClientVerificationStatus status) {
		return candidateRepo.searchForVerification(orgId, q, status);
	}

	public List<Candidate> searchCandidates(String orgId, String query, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		if (query == null || query.isBlank()) {
			return candidateRepo.findByClient_OrgId(orgId, sort);
		}
		return candidateRepo.searchCandidates(orgId, query, sort);
	}

	public List<Candidate> getByDepartment(String orgId, Long deptId) {
		return candidateRepo.findByClient_OrgIdAndDepartment_Id(orgId, deptId);
	}

	public List<Candidate> getCandidatesByDept(String orgId, Long deptId, String q) {
		return candidateRepo.findByOrgAndDepartment(orgId, deptId, q);
	}

//	This method is for search functionality in Candidates page in Candidates section in Client portal
//	Search with Email, Location, Phone, Number, Role
	public List<Candidate> getCandidates(Long deptId, String q, ClientVerificationStatus status) {
		return candidateRepo.searchCandidates(deptId, q, status);
	}
=======
package com.ToFact.Verification.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.CandidateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Entity.Department;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

	private final CandidateRepository candidateRepo;
	private final ClientRepository clientRepo;
	private final DepartmentRepository departmentRepo;

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
		c.setStatus(ClientVerificationStatus.CREATED);
		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());
		// 🔥 EDUCATIONS
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(c));
			c.setEducations(dto.getEducations());
		}
		// 🔥 EXPERIENCES
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(exp -> exp.setCandidate(c));
			c.setExperiences(dto.getExperiences());
		}
		// 🔥 CLIENT LINK
		c.setClient(client);
		// 🔥🔥🔥 IMPORTANT PART (NEW)
		if (dto.getDepartmentId() != null) {
			Department dept = departmentRepo.findById(dto.getDepartmentId())
					.orElseThrow(() -> new RuntimeException("Department not found"));
			// 🔐 SECURITY CHECK
			if (!dept.getOrgId().equals(orgId)) {
				throw new RuntimeException("Unauthorized department access");
			}
			c.setDepartment(dept);
		}
		return candidateRepo.save(c);
	}

	// 🔹 GET ALL
	public List<Candidate> getByOrgId(String orgId) {
		System.out.println("FETCHING FOR ORG: " + orgId); // 🔥

		List<Candidate> list = candidateRepo.findByClient_OrgId(orgId);

		System.out.println("CANDIDATES FOUND: " + list.size());
		return list;
	}

	// 🔹 GET BY ID
	public Candidate getById(Long id, String orgId) {

		Candidate c = candidateRepo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}
		System.out.println(c.getEducations().size());

		return c;
	}

	// 🔹 UPDATE
	public Candidate update(Long id, CandidateDTO dto, String orgId) {

		Candidate existing = candidateRepo.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

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

		return candidateRepo.save(existing);
	}

	// 🔹 DELETE
	public void delete(Long id, String orgId) {
		Candidate c = getById(id, orgId);

		if (c.isLocked()) {
			throw new RuntimeException("Candidate is under verification and cannot be modified");
		}
		candidateRepo.delete(c);
	}

	// 🔹 STATUS UPDATE
	public Candidate updateStatus(Long id, ClientVerificationStatus status, String orgId) {

		Candidate c = getById(id, orgId);
		c.setStatus(status);
		return candidateRepo.save(c);
	}

	public List<Candidate> searchCandidates(String orgId, String query, String sortBy, String direction) {

		Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

		if (query == null || query.isBlank()) {
			return candidateRepo.findByClient_OrgId(orgId, sort);
		}

		return candidateRepo.searchCandidates(orgId, query, sort);
	}

	public List<Candidate> getByDepartment(String orgId, Long deptId) {
		return candidateRepo.findByClient_OrgIdAndDepartment_Id(orgId, deptId);
	}

	public List<Candidate> getCandidatesByDept(String orgId, Long deptId, String q) {
		return candidateRepo.findByOrgAndDepartment(orgId, deptId, q);
	}
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}