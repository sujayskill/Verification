package com.ToFact.Verification.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.UserDTO;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Entity.UserRole;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepo;
	private final ClientRepository clientRepo;
	private final PasswordEncoder passwordEncoder;

	// 🔹 Create User
	public User createUser(UserDTO dto) {

		Client client = null;

		if (dto.getRole() == UserRole.CLIENT || dto.getRole() == UserRole.CLIENT_ADMIN) {

		    if (dto.getOrgId() == null || dto.getOrgId().isEmpty()) {
		        throw new RuntimeException("orgId is required for client user");
		    }

		    client = clientRepo.findByOrgId(dto.getOrgId())
		        .orElseThrow(() -> new RuntimeException("Client not found with orgId: " + dto.getOrgId()));
		}
		
		System.out.println("ORG ID FROM REQUEST: " + dto.getOrgId());

		User user = User.builder().username(dto.getUsername()).password(passwordEncoder.encode(dto.getPassword()))
				.role(dto.getRole()).client(client).orgId(dto.getOrgId()).build();

		return userRepo.save(user);
	}

//     🔹 Get all users
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	// 🔹 Delete user
	public void deleteUser(Long id) {
		userRepo.deleteById(id);
	}

	public User toggleUserStatus(Long id) {
		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		user.setActive(!user.isActive());
		return userRepo.save(user);
	}

	public void changePassword(Long userId, String newPassword) {
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepo.save(user);
	}

	public List<User> getUsersByOrg(String orgId) {
		return userRepo.findListByOrgId(orgId);
	}
}