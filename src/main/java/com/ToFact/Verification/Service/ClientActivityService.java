package com.ToFact.Verification.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientActivityRepository;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientActivityService {

	private final CandidateRepository candidateRepo;
	private final ClientActivityRepository clientActivityRepo;
	private final ClientRepository clientRepo;
	private final NotificationService notificationservice;
	private final VerificationRepository verificationRepo;
	private final VendorNotificationsService vendorNotificationsService;

	public Verification create(Long candidateId, String orgId) {

		// 🔍 Fetch candidate
		Candidate c = candidateRepo.findById(candidateId)
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔐 SECURITY CHECK
		if (!c.getClient().getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized access");
		}

		// 🔍 Fetch org
		Client org = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Org not found"));

		// 🔍 Check existing verification
		Optional<Verification> existingOpt = verificationRepo.findTopByCandidateIdOrderByCreatedAtDesc(candidateId);

		// =========================================================
		// 🔁 CASE 1: RE-INITIATE (ROLLED BACK)
		// =========================================================
		if (existingOpt.isPresent()) {

			Verification v = existingOpt.get();

			if (v.getStatus() != VerificationStatus.ROLLED_BACK) {
				throw new RuntimeException("Verification already in progress");
			}

			// 🔄 RESET EXISTING RECORD
			v.setCandidateId(candidateId);
			v.setStatus(VerificationStatus.INITIATED);
			v.setCreatedAt(LocalDateTime.now());
			c.setStatus(ClientVerificationStatus.INITIATED);
			v.setSlaDeadline(LocalDateTime.now().plusDays(7));

			// ✅ NEW → Attach Department
			if (c.getDepartment() != null) {
				v.setDepartment(c.getDepartment());
			}

			// 🔄 CLEAR OLD DATA
			v.setReportData(null);
			v.setFinalRemarks(null);
			v.setRiskLevel(null);
			v.setComment(null);
			v.setDocumentUrl(null);
			v.setRollbackRequested(false);

			// 🔒 Lock candidate
			c.setLocked(true);
			candidateRepo.save(c);

			Verification saved = verificationRepo.save(v);

			// 🚀 PUSH LIVE UPDATE
			vendorNotificationsService.pushToVendor(saved);

			return saved;
		}

		// =========================================================
		// 🆕 CASE 2: NEW VERIFICATION
		// =========================================================

		if (c.isLocked()) {
			throw new RuntimeException("Candidate already under verification");
		}

		// 🔒 Lock candidate
		c.setLocked(true);
		candidateRepo.save(c);

		Verification v = new Verification();

		v.setCandidateId(candidateId);
		v.setOrgId(orgId);
		v.setOrganizationName(org.getCompanyName());
		v.setCandidateName(c.getFirstName() + " " + c.getLastName());
		v.setCandidateEmail(c.getEmail());
		c.setStatus(ClientVerificationStatus.INITIATED);
		v.setStatus(VerificationStatus.INITIATED);
		v.setCreatedAt(LocalDateTime.now());
		v.setSlaDeadline(LocalDateTime.now().plusDays(7));

		// ✅ NEW → Attach Department
		if (c.getDepartment() != null) {
			v.setDepartment(c.getDepartment());
		}

		Verification saved = verificationRepo.save(v);

		// 🚀 PUSH LIVE UPDATE
		vendorNotificationsService.pushToVendor(saved);

		return saved;
	}

	

	public List<Map<String, Object>> getMonthlyHiringData(String orgId) {

		List<Object[]> rows = clientActivityRepo.getMonthlyData(orgId);

		List<Map<String, Object>> result = new ArrayList<>();

		for (Object[] r : rows) {
			Map<String, Object> map = new HashMap<>();
			map.put("month", r[0]);
			map.put("count", r[1]);
			result.add(map);
		}

		return result;
	}

//	This is for rolling back the verification request from vendor
	public Verification requestRollback(Long id, String orgId) {

		Verification v = verificationRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Verification not found"));

		// 🔥 FETCH REAL CANDIDATE
		Candidate c = candidateRepo.findById(v.getCandidateId())
				.orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔐 SECURITY
		if (!v.getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		if (v.getStatus() == VerificationStatus.COMPLETED) {
			throw new RuntimeException("Cannot rollback completed verification");
		}

		// 🔥 UPDATE VERIFICATION STATUS
		v.setStatus(VerificationStatus.ROLLBACK_REQUESTED);

		// 🔥 UPDATE CANDIDATE STATUS
		c.setStatus(ClientVerificationStatus.ROLLBACK_REQUESTED);

		// 🔥 SAVE CANDIDATE
		candidateRepo.save(c);

		notificationservice.sendToVendor("Rollback requested for " + v.getCandidateName());

		return verificationRepo.save(v);
	}

}
