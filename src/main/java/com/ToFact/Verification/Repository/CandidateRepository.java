package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.ClientVerificationStatus;

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

//	Find candidate by Client and Department
	List<Candidate> findByClient_OrgIdAndDepartment_Id(String orgId, Long deptId);

	@Query("""
			    SELECT c FROM Candidate c
			    WHERE c.client.orgId = :orgId
			    AND c.department.id = :deptId
			    AND (
			        :q IS NULL OR
			        LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR
			        LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    ORDER BY c.createdAt DESC
			""")
	List<Candidate> findByOrgAndDepartment(@Param("orgId") String orgId, @Param("deptId") Long deptId,
			@Param("q") String q);

	long countByClient_OrgId(String orgId);

	long countByClientOrgIdAndStatusIn(String orgId, List<ClientVerificationStatus> statuses);

	long countByClient_OrgIdAndStatus(String orgId, ClientVerificationStatus status);

	@Query("""
			    SELECT c
			    FROM Candidate c
			    WHERE c.department.id = :deptId
			    AND (
			        LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    ORDER BY c.createdAt DESC
			""")
	List<Candidate> findByDepartmentIdAndSearch(@Param("deptId") Long deptId, @Param("q") String q);

	@Query("""
			    SELECT c
			    FROM Candidate c
			    WHERE c.client.orgId = :orgId

			    AND (
			        :q IS NULL
			        OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.location) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.role) LIKE LOWER(CONCAT('%', :q, '%'))
			    )

			    AND (
			        :status IS NULL
			        OR c.status = :status
			    )

			    ORDER BY c.createdAt DESC
			""")
	List<Candidate> searchForVerification(@Param("orgId") String orgId, @Param("q") String q,
			@Param("status") ClientVerificationStatus status);

//  MYSQL
//This method is for search functionality in Candidates page in Candidates section in Client portal
//Search with Email, Location, Phone, Number, Role
	@Query("""
			    SELECT c FROM Candidate c
			    WHERE c.department.id = :deptId
			    AND (
			        :q IS NULL OR
			        LOWER(CONCAT(c.firstName, ' ', c.lastName))
			        LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.email)
			        LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.location)
			        LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.role)
			        LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.phone)
			        LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    AND (
			        :status IS NULL
			        OR c.status = :status
			    )
			    ORDER BY c.createdAt DESC
			""")
	List<Candidate> searchCandidates(@Param("deptId") Long deptId, @Param("q") String q, @Param("status") ClientVerificationStatus status);

}

//PL-SQL
//This method is for search functionality in Candidates page in Candidates section in Client portal
//Search with Email, Location, Phone, Number, Role
//@Query("""
//		SELECT c
//		FROM Candidate c
//		WHERE c.department.id = :deptId
//		AND (
//		    :q IS NULL
//		    OR LOWER(c.firstName)
//		       LIKE LOWER(CONCAT('%', :q, '%'))
//		    OR LOWER(c.lastName)
//		       LIKE LOWER(CONCAT('%', :q, '%'))
//		    OR LOWER(c.email)
//		       LIKE LOWER(CONCAT('%', :q, '%'))
//		    OR LOWER(COALESCE(c.location, ''))
//		       LIKE LOWER(CONCAT('%', :q, '%'))
//		    OR LOWER(COALESCE(c.role, ''))
//		       LIKE LOWER(CONCAT('%', :q, '%'))
//		    OR COALESCE(c.phone, '')
//		       LIKE CONCAT('%', :q, '%')
//		) AND ( :status IS NULL OR c.status = :status ) ORDER BY c.createdAt DESC """)
//List<Candidate> searchCandidates(@Param("deptId") Long deptId, @Param("q") String q, @Param("status") ClientVerificationStatus status);
