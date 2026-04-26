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
	private final NotificationService notificationService;

    // 🔹 CREATE USER
    public User createUser(UserDTO dto) {

        Client client = null;

        // 🔥 CLIENT USERS MUST HAVE ORG
        if (dto.getRole() == UserRole.CLIENT || dto.getRole() == UserRole.CLIENT_ADMIN) {

            if (dto.getOrgId() == null || dto.getOrgId().isEmpty()) {
                throw new RuntimeException("orgId is required for client users");
            }

            client = clientRepo.findByOrgId(dto.getOrgId())
                    .orElseThrow(() ->
                            new RuntimeException("Client not found with orgId: " + dto.getOrgId()));
        }

        // 🔥 CREATE USER
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        user.setClient(client);
        user.setOrgId(dto.getOrgId());
        user.setActive(true);

        notificationService.sendToClient(dto.getOrgId(), "New User "+dto.getFirstName()+" "+dto.getLastName()+" has been added ");
        return userRepo.save(user);
        
    }

    // 🔹 GET ALL USERS
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // 🔹 GET USERS BY ORG
    public List<User> getUsersByOrg(String orgId) {
        return userRepo.findListByOrgId(orgId);
    }

    // 🔹 DELETE USER
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    // 🔹 TOGGLE ACTIVE (BLOCK / UNBLOCK)
    public User toggleUserStatus(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive());
        return userRepo.save(user);
    }

    // 🔹 CHANGE PASSWORD
    public void changePassword(Long userId, String newPassword) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }
    
    public User getCurrentUser(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}