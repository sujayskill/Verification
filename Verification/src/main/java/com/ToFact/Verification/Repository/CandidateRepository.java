package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
//    List<OrgCandidate> findByOrgAccountId(Long orgAccountId);

	@Query("""
			    SELECT c FROM Candidate c
			    WHERE c.client.orgId = :orgId
			    AND (
			        LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
			        OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
			    )
			""")
	List<Candidate> searchCandidates(@Param("orgId") String orgId, @Param("query") String query, Sort sort);

	List<Candidate> findByClient_OrgId(String orgId, Sort sort);

	List<Candidate> findByClient_OrgId(String orgId);

	Page<Candidate> findByClient_OrgId(String orgId, Pageable pageable);

	Page<Candidate> findByClient_OrgIdAndFirstNameContainingIgnoreCaseOrClient_OrgIdAndEmailContainingIgnoreCase(
			String orgId1, String name, String orgId2, String email, Pageable pageable);

//	This is to group the candidates by client in vendor clients section
	List<Candidate> findByClient_Id(Long clientId);

//	This is search for vendor client's candidates section
	@Query("""
			    SELECT c FROM Candidate c
			    WHERE c.client.id = :clientId
			    AND (
			        LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			""")
	List<Candidate> searchByClientId(Long clientId, String q);
}
