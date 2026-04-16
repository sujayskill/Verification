package com.ToFact.Verification.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.ClientManagement.Entity.Candidate;
import com.ToFact.Verification.ClientManagement.Repository.CandidateRepository;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationService {

	private final VerificationRepository repo;
	private final CandidateRepository candidateRepo;
	private final ClientRepository clientRepo;
	private final NotificationService notificationService;

	public Verification create(Long candidateId, String orgId) {

		// 🔥 Prevent duplicate BGV
		if (repo.existsByCandidateId(candidateId)) {
			throw new RuntimeException("Verification already initiated");
		}

		Candidate c = candidateRepo.findById(candidateId)
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔐 SECURITY CHECK
		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}

		Client org = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Org not found"));

		System.out.println("verification completed");

		Verification v = new Verification();
		v.setCandidateId(candidateId);
		v.setOrgId(orgId);
		v.setOrganizationName(org.getCompanyName());
		v.setCandidateName(c.getFirstName() + " " + c.getLastName());
		v.setStatus(VerificationStatus.INITIATED);
		v.setCreatedAt(LocalDateTime.now());

//		For SLA
		v.setSlaDeadline(LocalDateTime.now().plusDays(3));

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

	public Verification updateStatus(Long id, VerificationStatus status) {

		Verification v = repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));

		v.setStatus(status);

		// 🔥 SEND NOTIFICATION
		notificationService.create(v.getOrgId(), "Verification for " + v.getCandidateName() + " is now " + status);

		// 🔥 GENERATE REPORT WHEN COMPLETED
		if (status == VerificationStatus.COMPLETED) {
			String reportPath = generateReport(v);
			v.setReportUrl(reportPath);
		}

		return repo.save(v);
	}

	public Verification getById(Long id) {
		return repo.findById(id).orElseThrow(() -> new RuntimeException("Verification not found"));
	}

//	Comment and file upload functionality
	// 🔥 ADD COMMENT
	public Verification addComment(Long id, String comment) {

		Verification v = repo.findById(id).orElseThrow();
		v.setComment(comment);

		return repo.save(v);
	}

	// 🔥 ADD DOCUMENT
	public Verification uploadDocument(Long id, String filePath) {

		Verification v = repo.findById(id).orElseThrow();
		v.setDocumentUrl(filePath);

		return repo.save(v);
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

	private String generateReport(Verification v) {
		try {
			String fileName = "reports/report_" + v.getId() + ".txt";
			String content = """
					===== BGV REPORT =====

					Candidate: %s
					Organization: %s

					Status: %s

					Generated At: %s
					""".formatted(v.getCandidateName(), v.getOrganizationName(), v.getStatus(), LocalDateTime.now());

			Files.writeString(Paths.get(fileName), content);
			return fileName;
		} catch (Exception e) {
			throw new RuntimeException("Report generation failed");
		}
	}
}