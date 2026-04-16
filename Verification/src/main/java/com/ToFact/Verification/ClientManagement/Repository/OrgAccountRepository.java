package com.ToFact.Verification.ClientManagement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.ClientManagement.Entity.OrgAccount;

public interface OrgAccountRepository extends JpaRepository<OrgAccount, Long> {
    Optional<OrgAccount> findByUsername(String username);
    
}