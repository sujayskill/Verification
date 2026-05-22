<<<<<<< HEAD
package com.ToFact.Verification.Controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Dto.AuthResponse;
import com.ToFact.Verification.Dto.RefreshRequest;
import com.ToFact.Verification.Dto.UserDTO;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Repository.UserRepository;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.SecurityConfigEntity.RefreshToken;
import com.ToFact.Verification.SecurityConfigRepository.copy2.RefreshTokenRepository;
import com.ToFact.Verification.Service.AuthService;
import com.ToFact.Verification.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;
	private final JwtUtil jwtUtil;
	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;
	private final AuthService authService;
	private final RefreshTokenRepository refreshTokenRepo;

	@PostMapping("/register")
	public User register(@RequestBody UserDTO user) {
		return userService.createUser(user);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

		return authService.login(req.get("username"), req.get("password"));
	}

	@PostMapping("/refresh")
	public AuthResponse refresh(@RequestBody RefreshRequest request) {

		System.out.println("REFRESH API HIT");
		RefreshToken storedToken = refreshTokenRepo.findByToken(request.getRefreshToken())
				.orElseThrow(() -> new RuntimeException("Invalid refresh token"));
		if (storedToken.isRevoked()) {
			throw new RuntimeException("Refresh token revoked");
		}
		if (storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Refresh token expired");
		}
		User user = userRepo.findByUsername(storedToken.getUsername()).orElseThrow();
		
		System.out.println("OLD REFRESH TOKEN: " + request.getRefreshToken());

// ========================= GENERATE TOKENS =========================

		String newAccessToken = jwtUtil.generateToken(user);
		String newRefreshToken = jwtUtil.generateRefreshToken(user);

// ========================= REVOKE OLD TOKEN =========================
		storedToken.setRevoked(true);
		refreshTokenRepo.save(storedToken);

// ========================= SAVE NEW REFRESH TOKEN =========================

		RefreshToken tokenEntity = new RefreshToken();
		tokenEntity.setUsername(user.getUsername());
		tokenEntity.setToken(newRefreshToken);
		tokenEntity.setRevoked(false);
		tokenEntity.setExpiryDate(LocalDateTime.now().plusDays(7));
		refreshTokenRepo.save(tokenEntity);
		System.out.println("NEW ACCESS TOKEN GENERATED");
		System.out.println("NEW REFRESH TOKEN GENERATED");
		System.out.println("TOKEN REFRESH SUCCESS");
		return new AuthResponse(newAccessToken, newRefreshToken);
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(Authentication auth) {

		String username = auth.getName();
		refreshTokenRepo.deleteByUsername(username);
		return ResponseEntity.ok("Logged out successfully");

	}
=======
package com.ToFact.Verification.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Dto.UserDTO;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Repository.UserRepository;
import com.ToFact.Verification.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;
	private final JwtUtil jwtUtil;
	private final UserRepository userRepo;

	private final PasswordEncoder passwordEncoder;

	@PostMapping("/register")
	public User register(@RequestBody UserDTO user) {
		return userService.createUser(user);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

	    String username = req.get("username");
	    String password = req.get("password");

	    if (username == null || password == null) {
	        return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
	    }

	    User user = userRepo.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (!passwordEncoder.matches(password, user.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("error", "Invalid password"));
	    }

	    if (!user.isActive()) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body(Map.of("error", "ACCESS_DENIED"));
	    }

	    String token = jwtUtil.generateToken(user);

	    return ResponseEntity.ok(Map.of("token", token));
	}
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}