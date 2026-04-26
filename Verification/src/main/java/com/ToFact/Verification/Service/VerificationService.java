package com.ToFact.Verification.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.ClientReportDTO;
import com.ToFact.Verification.Dto.VerificationDTO;
import com.ToFact.Verification.Dto.VerificationUpdateDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.VerificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationService {

	private final VerificationRepository repo;
	private final CandidateRepository candidateRepo;
	private final ClientRepository clientRepo;
	private final NotificationService notificationService;

	public Verification create(Long candidateId, String orgId) {

		Optional<Verification> existingOpt = repo.findTopByCandidateIdOrderByCreatedAtDesc(candidateId);

		Candidate c = candidateRepo.findById(candidateId)
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔐 SECURITY
		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}

		Client org = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Org not found"));

		// 🔥 CASE 1: EXISTING RECORD
		if (existingOpt.isPresent()) {
			Verification v = existingOpt.get();

			// ❌ Already active
			if (v.getStatus() != VerificationStatus.ROLLED_BACK) {
				throw new RuntimeException("Verification already in progress");
			}

			// ♻️ RE-INITIATE SAME RECORD
			v.setStatus(VerificationStatus.INITIATED);
			v.setCreatedAt(LocalDateTime.now());
			v.setSlaDeadline(LocalDateTime.now().plusDays(3));

			// 🔄 CLEAR OLD DATA (IMPORTANT)
			v.setReportData(null);
			v.setFinalRemarks(null);
			v.setRiskLevel(null);
			v.setComment(null);
			v.setDocumentUrl(null);
			v.setRollbackRequested(false);

			// 🔒 LOCK candidate again
			c.setLocked(true);
			candidateRepo.save(c);

			return repo.save(v);
		}

		// 🔥 CASE 2: FIRST TIME (CREATE NEW)
		if (c.isLocked()) {
			throw new RuntimeException("Candidate already under verification");
		}

		c.setLocked(true);
		candidateRepo.save(c);

		Verification v = new Verification();
		v.setCandidateId(candidateId);
		v.setOrgId(orgId);
		v.setOrganizationName(org.getCompanyName());
		v.setCandidateName(c.getFirstName() + " " + c.getLastName());
		v.setCandidateEmail(c.getEmail());
		v.setStatus(VerificationStatus.INITIATED);
		v.setCreatedAt(LocalDateTime.now());
		v.setSlaDeadline(LocalDateTime.now().plusDays(7));

		return repo.save(v);
	}

	public List<Verification> getAll() {
		List<Verification> list = repo.findAll();

		list.forEach(this::checkSLA);

		return list;
	}

	public List<Verification> getByOrg(String orgId) {
		return repo.findByOrgId(orgId);
	}

	public boolean exists(Long candidateId) {
		return repo.existsByCandidateId(candidateId);
	}

//	It gives details by candidates
	public Verification getByCandidate(Long candidateId, String orgId) {

		Verification v = repo.findByCandidateId(candidateId)
				.orElseThrow(() -> new RuntimeException("Verification not found"));

		if (!v.getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		return v;
	}

	public Verification updateStatus(Long id, VerificationStatus status) {

		Verification v = repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));

		v.setStatus(status);

		// 🔥 SEND NOTIFICATION
		notificationService.sendToClient(v.getOrgId(),
				"Verification for " + v.getCandidateName() + " is now " + status);
		// 🔥 GENERATE REPORT WHEN COMPLETED
		if (status == VerificationStatus.COMPLETED) {

			String reportJson = """
					{
					    "basicCheck": "VERIFIED",
					    "addressCheck": "MATCHED",
					    "educationChecks": [
					        {
					            "name": "B.Tech",
					            "status": "VERIFIED",
					            "remarks": "Valid degree"
					        }
					    ]
					}
					""";

			v.setReportData(reportJson); // 🔥 THIS IS REQUIRED
			notificationService.sendToClient(v.getOrgId(), "Report generated for " + v.getCandidateName());
		}

		return repo.save(v);
	}

	public Verification getById(Long id) {
		return repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));
	}

//	SLA Verification functionality
	private void checkSLA(Verification v) {
		// 🔥 FIX: handle null deadline
		if (v.getSlaDeadline() == null) {
			return;
		}
		if (v.getStatus() != VerificationStatus.COMPLETED && LocalDateTime.now().isAfter(v.getSlaDeadline())) {
			v.setSlaBreached(true);
		}
	}

//	Functionality for status metrics in Verification Status
	public Map<String, Map<String, Long>> getStatusSummary() {
		List<Verification> list = repo.findAll();
		Map<String, Map<String, Long>> result = new HashMap<>();
		for (Verification v : list) {
			String org = v.getOrganizationName();
			result.putIfAbsent(org, new HashMap<>());
			Map<String, Long> statusMap = result.get(org);
			String status = v.getStatus().name();
			statusMap.put(status, statusMap.getOrDefault(status, 0L) + 1);
		}
		return result;
	}

//	this is for report generation
	private String generateReport(Verification v) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> data = mapper.readValue(v.getReportData(), Map.class);

			String fileName = "reports/report_" + v.getId() + ".txt";

			String content = """
					===== BGV REPORT =====

					🔹 Candidate Summary
					Name: %s
					Organization: %s

					🔹 Verification Summary
					Status: %s
					Risk Level: %s

					🔹 Checks:
					Basic: %s
					Address: %s

					Education: %s
					Experience: %s

					🔹 Final Remarks:
					%s

					Generated At: %s
					""".formatted(v.getCandidateName(), v.getOrganizationName(), v.getStatus(), v.getRiskLevel(),
					data.get("basicCheck"), data.get("addressCheck"), data.get("educationChecks"),
					data.get("experienceChecks"), v.getFinalRemarks(), LocalDateTime.now());

			Files.writeString(Paths.get(fileName), content);
			return fileName;

		} catch (Exception e) {
			throw new RuntimeException("Report generation failed");
		}
	}

//	Saving verification Data to generate the reports
	public Verification saveVerificationData(Long id, VerificationUpdateDTO dto) {

		Verification v = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

		try {
			ObjectMapper mapper = new ObjectMapper();

			Map<String, Object> report = new HashMap<>();

			report.put("basicCheck", dto.getBasicCheckStatus());
			report.put("addressCheck", dto.getAddressStatus());
			report.put("educationChecks", dto.getEducationChecks());
			report.put("experienceChecks", dto.getExperienceChecks());

			v.setReportData(mapper.writeValueAsString(report));
			v.setFinalRemarks(dto.getFinalRemarks());
			v.setRiskLevel(dto.getRiskLevel());

		} catch (Exception e) {
			throw new RuntimeException("Failed to store report data");
		}

		return repo.save(v);
	}

//	This is to fetch the client wise verification details for 4.2 module
	public List<VerificationDTO> getByOrgDTO(String orgId) {

		List<Verification> list = repo.findByOrgId(orgId);

		list.forEach(this::checkSLA);

		return list.stream()
				.map(v -> VerificationDTO.builder().id(v.getId()).candidateName(v.getCandidateName())
						.status(v.getStatus()).reportAvailable(v.getReportUrl() != null).createdAt(v.getCreatedAt())
						.slaDeadline(v.getSlaDeadline()).build())
				.toList();
	}

	public List<VerificationDTO> getCompletedReports(String orgId, String q) {

		List<Verification> list = repo.findByOrgIdAndStatus(orgId, VerificationStatus.COMPLETED);

		// 🔍 SEARCH FILTER
		if (q != null && !q.trim().isEmpty()) {
			list = list.stream().filter(v -> v.getCandidateName().toLowerCase().contains(q.toLowerCase())).toList();
		}

		return list.stream().map(v -> {
			VerificationDTO dto = new VerificationDTO();
			dto.setId(v.getId());
			dto.setCandidateName(v.getCandidateName());
			dto.setStatus(v.getStatus());
			dto.setReportAvailable(v.getReportData() != null);
			dto.setCreatedAt(v.getCreatedAt());
			return dto;
		}).toList();
	}

//	This is for rolling back the verification request from vendor
	public Verification requestRollback(Long id, String orgId) {

		Verification v = repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));

		// 🔐 SECURITY
		if (!v.getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		if (v.getStatus() == VerificationStatus.COMPLETED) {
			throw new RuntimeException("Cannot rollback completed verification");
		}

		// 🔁 MARK REQUEST
		v.setStatus(VerificationStatus.ROLLBACK_REQUESTED);

		notificationService.sendToVendor("Rollback requested for " + v.getCandidateName());

		return repo.save(v);
	}

//	this is for verification rollback request approval to client 
	public Verification rollback(Long id) {

		Verification v = repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));

		if (v.getStatus() != VerificationStatus.ROLLBACK_REQUESTED) {
			throw new RuntimeException("Rollback not requested");
		}

		Candidate c = candidateRepo.findById(v.getCandidateId())
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔓 UNLOCK
		c.setLocked(false);
		candidateRepo.save(c);

		v.setStatus(VerificationStatus.ROLLED_BACK);

		notificationService.sendToClient(v.getOrgId(), "Rollback approved for " + v.getCandidateName());
		return repo.save(v);
	}

//	It gets candidate wise details
	public Verification getByCandidate(Long candidateId) {
		return repo.findByCandidateId(candidateId).orElseThrow(() -> new RuntimeException("Verification not found"));
	}

//	This method is for search functionality in client verifications page
	public Page<Verification> searchVerifications(String orgId, String query, Pageable pageable) {

		if (query == null || query.isBlank()) {
			return repo.findByOrgId(orgId, pageable);
		}

		return repo.findByOrgIdAndCandidateNameContainingIgnoreCaseOrOrgIdAndCandidateEmailContainingIgnoreCase(orgId,
				query, orgId, query, pageable);
	}

//	Search functionality for Verification Requests candidate wise
	public Page<Client> searchClients(String q, String location, Integer size, int page, int limit) {

		Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());

		String query = (q == null || q.isBlank()) ? "" : q;

		return clientRepo.searchClients(query, location, size, pageable);
	}

////	Comment and file upload functionality
//	// 🔥 ADD COMMENT
//	public Verification addComment(Long id, String comment) {
//
//		Verification v = repo.findById(id).orElseThrow();
//		v.setComment(comment);
//
//		return repo.save(v);
//	}
//
//	// 🔥 ADD DOCUMENT
//	public Verification uploadDocument(Long id, String filePath) {
//
//		Verification v = repo.findById(id).orElseThrow();
//		v.setDocumentUrl(filePath);
//
//		return repo.save(v);
//	}
}