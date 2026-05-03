package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Verification;

public interface ClientActivityRepository extends JpaRepository<Verification, Long> {

	@Query("""
			    SELECT
			        FUNCTION('MONTH', v.createdAt) as month,
			        COUNT(v.id)
			    FROM Verification v
			    WHERE v.orgId = :orgId
			    GROUP BY FUNCTION('MONTH', v.createdAt)
			    ORDER BY month
			""")
	List<Object[]> getMonthlyData(@Param("orgId") String orgId);

}
