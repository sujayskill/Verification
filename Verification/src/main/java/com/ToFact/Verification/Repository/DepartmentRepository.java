package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

	List<Department> findByOrgIdOrderByCreatedAtDesc(String orgId);

	List<Department> findByOrgIdAndNameContainingIgnoreCase(String orgId, String name);

	List<Department> findByClient_OrgIdOrderByCreatedAtDesc(String orgId);

	@Query("""
			    SELECT d FROM Department d
			    WHERE d.orgId = :orgId
			    AND LOWER(d.name) LIKE LOWER(CONCAT('%', :q, '%'))
			    ORDER BY d.createdAt DESC
			""")
	List<Department> searchDepartments(@Param("orgId") String orgId, @Param("q") String q);
	List<Department> findByOrgId(String orgId);

}
