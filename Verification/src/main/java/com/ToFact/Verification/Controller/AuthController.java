package com.ToFact.Verification.Controller;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
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
	public User register(@RequestBody User user) {
		return userService.register(user);
	}

	@PostMapping("/login")
	public Map<String, String> login(@RequestBody Map<String, String> req) {

		User user = userRepo.findByUsername(req.get("username"))
				.orElseThrow(() -> new RuntimeException("User not found"));

		// 🔥 skip password validation for now

		String token = jwtUtil.generateToken(user);

		return Map.of("token", token);
	}
}