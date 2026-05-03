package com.ToFact.Verification.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

	@Query("""
			    SELECT c FROM Client c
			    WHERE
			        (
			            LOWER(c.companyName) LIKE LOWER(CONCAT('%', :q, '%'))
			            OR LOWER(c.companySlug) LIKE LOWER(CONCAT('%', :q, '%'))
			            OR LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :q, '%'))
			        )
			        AND (:location IS NULL OR LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%')))
			        AND (:size IS NULL OR c.employeeCount = :size)
			    ORDER BY c.createdAt DESC
			""")
	List<Client> searchClients(@Param("q") String q, @Param("location") String location, @Param("size") Integer size);

	Optional<Client> findByOrgId(String orgId);

	Optional<Client> findByCompanySlug(String companySlug);

	
	
	@Query("""
			    SELECT c FROM Client c
			    WHERE
			        LOWER(c.companyName) LIKE LOWER(CONCAT('%', :q, '%'))
			        OR LOWER(c.companySlug) LIKE LOWER(CONCAT('%', :q, '%'))
			    AND (:location IS NULL OR LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%')))
			    AND (:size IS NULL OR c.employeeCount = :size)
			""")
	Page<Client> searchClients(@Param("q") String q, @Param("location") String location, @Param("size") Integer size,
			Pageable pageable);
	
	long countByIsActiveTrue();
	
	long countByIsActiveFalse();
}
