package com.ToFact.Verification.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.ClientVerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientActivityRepository;
import com.ToFact.Verification.Repository.ClientDashboardRepository;
import com.ToFact.Verification.Repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientDashboardService {

	private final ClientDashboardRepository clientDashboardRepo;

	public Map<String, Object> getClientDashboard(String orgId) {

		Map<String, Object> res = new HashMap<>();
		// COUNTS
		long totalVerifications = clientDashboardRepo.countByClient_OrgId(orgId);
		long initiated = clientDashboardRepo.countByClient_OrgIdAndStatus(orgId, ClientVerificationStatus.INITIATED);
		long inProgress = clientDashboardRepo.countByClientOrgIdAndStatusIn(orgId,
				List.of(ClientVerificationStatus.INITIATED, ClientVerificationStatus.IN_PROGRESS,
						ClientVerificationStatus.ROLLBACK_REQUESTED, ClientVerificationStatus.ROLLED_BACK));
		long completed = clientDashboardRepo.countByClient_OrgIdAndStatus(orgId, ClientVerificationStatus.COMPLETED);

		// SUMMARY
		Map<String, Object> summary = new HashMap<>();

		summary.put("totalVerifications", totalVerifications);
		summary.put("inProgress", inProgress);
		summary.put("completed", completed);
		summary.put("averageTatHours", 48);

		// PIPELINE
		Map<String, Object> pipeline = new HashMap<>();

		pipeline.put("initiated", initiated);
		pipeline.put("inProgress", inProgress);
		pipeline.put("review", 3);
		pipeline.put("reportReady", completed);
		pipeline.put("completed", completed);

		// PROGRESS
		List<Map<String, Object>> progress = new ArrayList<>();
		progress.add(Map.of("title", "Employment Verification", "completed", completed, "total", totalVerifications));
		progress.add(Map.of("title", "Address Verification", "completed", completed, "total", totalVerifications));
		progress.add(Map.of("title", "Education Verification", "completed", completed, "total", totalVerifications));

		// RECENT ACTIVITIES
		List<Map<String, Object>> recentActivities = new ArrayList<>();
		recentActivities.add(Map.of("title", "Verification initiated", "timeAgo", "2 hrs ago"));
		recentActivities.add(Map.of("title", "Candidate report generated", "timeAgo", "5 hrs ago"));

		// RESPONSE
		res.put("summary", summary);
		res.put("pipeline", pipeline);
		res.put("progress", progress);
		res.put("recentActivities", recentActivities);

		return res;
	}

}
