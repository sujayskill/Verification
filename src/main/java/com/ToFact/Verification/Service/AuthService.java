package com.ToFact.Verification.Service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.LoginResponseDTO;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Repository.UserRepository;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.SecurityConfigEntity.RefreshToken;
import com.ToFact.Verification.SecurityConfigRepository.copy2.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final RefreshTokenRepository refreshTokenRepo;

	public ResponseEntity<?> login(String username, String password) {

		// VALIDATION
		if (username == null || password == null) {
			return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
		}

		// FETCH USER
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		// PASSWORD CHECK
		if (!passwordEncoder.matches(password, user.getPassword())) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
		}
		
		// USER ACTIVE CHECK
		if (!user.isActive()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "ACCESS_DENIED"));
		}
		
		// ACCESS TOKEN
		String accessToken = jwtUtil.generateToken(user);
		// REFRESH TOKEN
		String refreshTokenValue = jwtUtil.generateRefreshToken(user);
		// SAVE REFRESH TOKEN
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUsername(user.getUsername());
		refreshToken.setToken(refreshTokenValue);
		refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
		refreshTokenRepo.save(refreshToken);
		// RESPONSE
		LoginResponseDTO response = new LoginResponseDTO();
		response.setAccessToken(accessToken);
		response.setRefreshToken(refreshTokenValue);
		response.setUsername(user.getUsername());
		response.setRole(user.getRole().name());
		response.setOrgId(user.getOrgId());
		return ResponseEntity.ok(response);
	}
}