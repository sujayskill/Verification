package com.ToFact.Verification.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Dto.UserDTO;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Repository.UserRepository;
import com.ToFact.Verification.Service.UserService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	private final UserService service;
	private final JwtUtil jwtUtil;
	private final UserRepository userRepo;

	// 🔹 CREATE USER
	@PostMapping("/create")
	public User create(@RequestBody UserDTO dto) {
		return service.createUser(dto);
	}

	// 🔹 GET ALL USERS
	@GetMapping("/getAll")
	public List<User> getAll() {
		return service.getAllUsers();
	}

	// 🔹 GET USERS BY CLIENT (ORG)
	@GetMapping("/client/{orgId}")
	public List<User> getByClient(@PathVariable String orgId) {
		return service.getUsersByOrg(orgId);
	}

	// 🔹 DELETE USER
	@DeleteMapping("/{id}")
	public String delete(@PathVariable Long id) {
		service.deleteUser(id);
		return "User deleted successfully";
	}

	// 🔹 BLOCK / UNBLOCK USER
	@PutMapping("/toggle/{id}")
	public User toggle(@PathVariable Long id) {
		System.out.println("Toggle API hit for id: " + id); // 🔥 DEBUG
		return service.toggleUserStatus(id);
	}

	// 🔹 CHANGE PASSWORD
	@PutMapping("/change-password/{id}")
	public String changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {

		if (body.get("password") == null || body.get("password").isEmpty()) {
			throw new RuntimeException("Password cannot be empty");
		}

		service.changePassword(id, body.get("password"));
		return "Password updated successfully";
	}

	@GetMapping("/me")
	public User getCurrentUser(@RequestHeader("Authorization") String authHeader) {

		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);

		String username = claims.getSubject();

		return service.getCurrentUser(username);
	}

	@PutMapping("/status/{id}")
	public User updateStatus(@PathVariable Long id, @RequestParam boolean active) {

		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		user.setActive(active); // ✅ SET EXACT VALUE
		return userRepo.save(user);
	}
}