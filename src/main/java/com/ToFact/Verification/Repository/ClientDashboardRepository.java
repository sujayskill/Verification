package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.ClientVerificationStatus;

public interface ClientDashboardRepository extends JpaRepository<Candidate, Long> {
	
	long countByClient_OrgId(String orgId);
	long countByClientOrgIdAndStatusIn(String orgId, List<ClientVerificationStatus> statuses);
	long countByClient_OrgIdAndStatus(String orgId, ClientVerificationStatus status);

}
