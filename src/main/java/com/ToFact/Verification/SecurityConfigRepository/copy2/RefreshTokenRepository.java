package com.ToFact.Verification.SecurityConfigRepository.copy2;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.SecurityConfigEntity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByToken(String token);
	void deleteByUsername(String username);
	
}