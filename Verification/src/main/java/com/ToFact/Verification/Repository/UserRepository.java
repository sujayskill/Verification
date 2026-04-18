package com.ToFact.Verification.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);
	Optional<User> findByOrgId(String orgId);
    List<User> findListByOrgId(String orgId);
	
}