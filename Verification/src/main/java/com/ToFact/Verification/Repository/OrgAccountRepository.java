<<<<<<< HEAD
package com.ToFact.Verification.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.OrgAccount;

public interface OrgAccountRepository extends JpaRepository<OrgAccount, Long> {
    Optional<OrgAccount> findByUsername(String username);
    
=======
package com.ToFact.Verification.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.OrgAccount;

public interface OrgAccountRepository extends JpaRepository<OrgAccount, Long> {
    Optional<OrgAccount> findByUsername(String username);
    
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}