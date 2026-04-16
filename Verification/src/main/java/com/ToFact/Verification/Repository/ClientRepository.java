package com.ToFact.Verification.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.User;

public interface ClientRepository  extends JpaRepository<Client, Long>{
	Optional<Client> findByOrgId(String orgId);
	
}
