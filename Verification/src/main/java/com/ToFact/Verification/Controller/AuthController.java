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
}