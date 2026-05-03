package com.ToFact.Verification.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientActivityRepository;
import com.ToFact.Verification.Repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientActivityService {

	private final CandidateRepository candidateRepo;
	private final ClientActivityRepository clientActivityRepo;
	private final NotificationService notificationservice;
	private final VerificationRepository verificationRepo;

	public Map<String, Object> getClientDashboard(String orgId) {

		Map<String, Object> res = new HashMap<>();

		// 🔹 TOTAL CANDIDATES
		long totalCandidates = candidateRepo.countByClient_OrgId(orgId);
		// 🔹 STATUS COUNTS
		long inProgress = candidateRepo.countByClientOrgIdAndStatusIn(orgId,
				List.of(ClientVerificationStatus.INITIATED, ClientVerificationStatus.IN_PROGRESS,ClientVerificationStatus.ROLLBACK_REQUESTED, ClientVerificationStatus.ROLLED_BACK));

		long completed = candidateRepo.countByClient_OrgIdAndStatus(orgId, ClientVerificationStatus.COMPLETED);

		// 🔥 GRAPH DATA (LAST 6 MONTHS)
		List<Map<String, Object>> hiringTrend = getMonthlyHiringData(orgId);

		res.put("totalCandidates", totalCandidates);
		res.put("inProgress", inProgress);
		res.put("completed", completed);
		res.put("hiringTrend", hiringTrend);

		return res;
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
		Candidate c = new Candidate();

		// 🔐 SECURITY
		if (!v.getOrgId().equals(orgId)) {
			throw new RuntimeException("Unauthorized");
		}

		if (v.getStatus() == VerificationStatus.COMPLETED) {
			throw new RuntimeException("Cannot rollback completed verification");
		}

		// 🔁 MARK REQUEST
		v.setStatus(VerificationStatus.ROLLBACK_REQUESTED);
		c.setStatus(ClientVerificationStatus.ROLLBACK_REQUESTED);
		notificationservice.sendToVendor("Rollback requested for " + v.getCandidateName());

		return verificationRepo.save(v);
	}

}
