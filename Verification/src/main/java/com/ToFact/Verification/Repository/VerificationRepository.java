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

	
	
//	This method is for implementing search functionality in verification page in client module 
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.orgId = :orgId
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> findByOrgIdOrderByCreatedAtDesc(@Param("orgId") String orgId);

//	This method is for implementing search functionality in verification page in client module 
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.orgId = :orgId
			    AND (
			        LOWER(v.candidateName) LIKE LOWER(CONCAT('%', :query, '%'))
			        OR LOWER(v.candidateEmail) LIKE LOWER(CONCAT('%', :query, '%'))
			    )
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> searchByOrgAndNameOrEmail(@Param("orgId") String orgId, @Param("query") String query);

	
	
//	This method is for searching departments in verifications in client module
	@Query("""
			    SELECT v FROM Verification v
			    JOIN Candidate c ON v.candidateId = c.id
			    WHERE c.client.orgId = :orgId
			    AND c.department.id = :deptId
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> findByOrgIdAndDepartment(@Param("orgId") String orgId, @Param("deptId") Long deptId);

//	This method is for searching departments in verifications in client module
	@Query("""
			    SELECT v FROM Verification v
			    JOIN Candidate c ON v.candidateId = c.id
			    WHERE c.client.orgId = :orgId
			    AND c.department.id = :deptId
			    AND (
			        LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> searchByDept(@Param("orgId") String orgId, @Param("deptId") Long deptId, @Param("q") String q);

	
	
//	This method is for getting the candidate reports in reports section client module
	@Query("""
			    SELECT v FROM Verification v
			    JOIN Candidate c ON v.candidateId = c.id
			    WHERE v.orgId = :orgId
			    AND v.status = 'COMPLETED'
			    AND c.department.id = :deptId
			""")
	List<Verification> findCompletedByDept(String orgId, Long deptId);

	
	
	
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

	
//	This method is used to filter the candidates by department in verification sections for vendor module  
	@Query("""
		    SELECT v FROM Verification v
		    WHERE v.orgId = :orgId
		    AND v.department.id = :deptId
		    AND (
		        :q IS NULL OR
		        LOWER(v.candidateName) LIKE LOWER(CONCAT('%', :q, '%')) OR
		        LOWER(v.candidateEmail) LIKE LOWER(CONCAT('%', :q, '%'))
		    )
		    ORDER BY v.createdAt DESC
		""")
	List<Verification> findByOrgAndDept(@Param("orgId") String orgId, @Param("deptId") Long deptId, @Param("q") String q);
	
	
	
//	This method is to list the candidates by department in reports section at vendor module
	@Query("""
		    SELECT v FROM Verification v
		    JOIN Candidate c ON c.id = v.candidateId
		    WHERE c.client.orgId = :orgId
		    AND c.department.id = :deptId
		    AND v.status = 'COMPLETED'
		""")
	List<Verification> findReportsByDept(@Param("orgId") String orgId, @Param("deptId") Long deptId);
	
	
	
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
			String orgId1, String name, String orgId2, String email);

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