package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;

public interface VendorActivityRepository extends JpaRepository<Verification, Long> {

	long countByStatus(VerificationStatus status);

	long countByStatusIn(List<VerificationStatus> statuses);

//	This method is to fetch the list of verification requests by client wise in verifications section at vendor module
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.orgId = :orgId
			    AND (
			        :q IS NULL OR
			        LOWER(v.candidateName) LIKE LOWER(CONCAT('%', :q, '%')) OR
			        LOWER(v.candidateEmail) LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> findByClientForVerification(@Param("orgId") String orgId, @Param("q") String q);

//	This method is to fetch the list of verifications by client wise in status section at vendor module
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.orgId = :orgId
			    AND (
			        :q IS NULL OR
			        LOWER(v.candidateName)
			            LIKE LOWER(CONCAT('%', :q, '%'))
			        OR
			        LOWER(v.candidateEmail)
			            LIKE LOWER(CONCAT('%', :q, '%'))
			    )
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> findByClientForStatus(@Param("orgId") String orgId, @Param("q") String q);

//	This method is to list the candidates by client in reports section at vendor module
	@Query("""
			    SELECT v FROM Verification v
			    WHERE v.orgId = :orgId
			    AND v.status = 'COMPLETED'
			    ORDER BY v.createdAt DESC
			""")
	List<Verification> findReportsByOrg(@Param("orgId") String orgId);

//	/------------------------------------------------------------- EXTRAS --------------------------------------------------------------------/

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
	List<Verification> findByOrgAndDept(@Param("orgId") String orgId, @Param("deptId") Long deptId,
			@Param("q") String q);
=======

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;

public interface VendorActivityRepository extends JpaRepository<Verification, Long> {

	long countByStatus(VerificationStatus status);

	long countByStatusIn(List<VerificationStatus> statuses);
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification

}
