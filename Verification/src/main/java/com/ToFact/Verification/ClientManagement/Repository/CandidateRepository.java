package com.ToFact.Verification.ClientManagement.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.ClientManagement.Entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
//    List<OrgCandidate> findByOrgAccountId(Long orgAccountId);
	List<Candidate> findByClient_OrgId(String orgId);
}
