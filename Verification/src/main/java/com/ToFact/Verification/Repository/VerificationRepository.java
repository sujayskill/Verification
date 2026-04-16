package com.ToFact.Verification.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.Entity.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
	
	boolean existsByCandidateId(Long candidateId);

	List<Verification> findByOrgId(String orgId);

	List<Verification> findAll();
	
}