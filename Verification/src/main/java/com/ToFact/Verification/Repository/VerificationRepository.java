package com.ToFact.Verification.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Dto.ClientReportDTO;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

	boolean existsByCandidateId(Long candidateId);

	List<Verification> findAll();

	Optional<Verification> findByCandidateId(Long candidateId);

	Optional<Verification> findTopByCandidateIdOrderByCreatedAtDesc(Long candidateId);

	Page<Verification> findByOrgId(String orgId, Pageable pageable);

	Page<Verification> findByOrgIdAndCandidateNameContainingIgnoreCaseOrOrgIdAndCandidateEmailContainingIgnoreCase(
			String orgId, String name, String orgId2, String email, Pageable pageable);

	// 🔹 CANDIDATE LEVEL
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.organizationName = :org
			    AND (
			        :q IS NULL OR
			        LOWER(v.candidateName) LIKE LOWER(CONCAT('%', :q, '%')) OR
			        LOWER(v.candidateEmail) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			""")
	Page<Verification> searchCandidates(@Param("org") String org, @Param("q") String q, Pageable pageable);

	List<Verification> findByOrgIdAndStatus(String orgId, VerificationStatus status);

	Page<Verification> findByStatus(VerificationStatus status, Pageable pageable);

	Page<Verification> findByStatusAndOrganizationNameContainingIgnoreCase(VerificationStatus status, String org,
			Pageable pageable);

	Page<Verification> findByStatusAndOrganizationNameAndCandidateNameContainingIgnoreCase(VerificationStatus status,
			String org, String name, Pageable pageable);

//	Search in verifications
	Page<Verification> findByOrganizationName(String organizationName, Pageable pageable);

	Page<Verification> findByOrganizationNameAndCandidateNameContainingIgnoreCase(String organizationName,
			String candidateName, Pageable pageable);

	Page<Verification> findByOrganizationNameContainingIgnoreCase(String name, Pageable pageable);

	List<Verification> findByOrgId(String orgId);
	
	List<Verification> findByOrgIdAndCandidateNameContainingIgnoreCaseOrOrgIdAndCandidateEmailContainingIgnoreCase(
		    String orgId1, String name,
		    String orgId2, String email
		);

	// 🔹 CLIENT LEVEL (grouping)
//		@Query("""
//				    SELECT new com.ToFact.Verification.DTO.ClientReportDTO(
//				        v.organizationName,
//				        COUNT(v)
//				    )
//				    FROM Verification v
//				    WHERE v.status = :status
//				    AND (:q IS NULL OR LOWER(v.organizationName) LIKE LOWER(CONCAT('%', :q, '%')))
//				    GROUP BY v.organizationName
//				    ORDER BY v.organizationName
//				""")
//		List<ClientReportDTO> getClientReportSummary(@Param("q") String q, @Param("status") VerificationStatus status);

}