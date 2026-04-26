package com.ToFact.Verification.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.VerificationDTO;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationsReportsService {

	private final VerificationRepository repo;

//	This method is for generating the reports for verification completed candidates from vendor
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

	// 🔹 GET ALL CLIENT VERIFICATIONS (for grouping)
	public List<Verification> getAll() {
		return repo.findAll();
	}

	// 🔹 GET ONLY COMPLETED REPORTS
	public List<Verification> getCompletedByOrg(String orgId) {
		return repo.findByOrgIdAndStatus(orgId, VerificationStatus.COMPLETED);
	}

	public Page<Map<String, Object>> getClientsGrouped(String q, Pageable pageable) {

		Page<Verification> pageData;

		if (q == null || q.isBlank()) {
			pageData = repo.findAll(pageable);
		} else {
			pageData = repo.findByOrganizationNameContainingIgnoreCase(q, pageable);
		}

		Map<String, List<Verification>> grouped = pageData.getContent().stream()
				.collect(Collectors.groupingBy(Verification::getOrganizationName));

		List<Map<String, Object>> result = new ArrayList<>();

		grouped.forEach((org, list) -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("organizationName", org);
			obj.put("count", list.size());
			obj.put("orgId", list.get(0).getOrgId()); // ✅ CRITICAL FIX
			result.add(obj);
		});

		return new PageImpl<>(result, pageable, pageData.getTotalElements());
	}
	
//	Search functionality for Verification Requests candidate wise
	public List<Verification> searchCandidates(String orgId, String query) {

		if (query == null || query.isBlank()) {
			return repo.findByOrgId(orgId);
		}

		return repo.findByOrgIdAndCandidateNameContainingIgnoreCaseOrOrgIdAndCandidateEmailContainingIgnoreCase(orgId,
				query, orgId, query);
	}

////	Search clients in vendor reports 
//	public Page<ClientReportDTO> getReportSummary(String q, Pageable pageable) {
//	    return repo.getClientReportSummary(q, pageable);
//	}
////	Search candidates in vendor reports 
//	public Page<Verification> getCompletedCandidates(String org, String q, Pageable pageable) {
//
//		if (q == null || q.isBlank()) {
//			return repo.findByStatusAndOrganizationNameContainingIgnoreCase(VerificationStatus.COMPLETED, org,
//					pageable);
//		}
//
//		return repo.findByStatusAndOrganizationNameAndCandidateNameContainingIgnoreCase(VerificationStatus.COMPLETED,
//				org, q, pageable);
//	}

//	This is to fetch the client wise verification details for 4.2 module
//	public List<VerificationDTO> getByOrgDTO(String orgId) {
//
//		List<Verification> list = repo.findByOrgId(orgId);
//
//		list.forEach(this::checkSLA);
//
//		return list.stream()
//				.map(v -> VerificationDTO.builder().id(v.getId()).candidateName(v.getCandidateName())
//						.status(v.getStatus()).reportAvailable(v.getReportUrl() != null).createdAt(v.getCreatedAt())
//						.slaDeadline(v.getSlaDeadline()).build())
//				.toList();
//	}

}
