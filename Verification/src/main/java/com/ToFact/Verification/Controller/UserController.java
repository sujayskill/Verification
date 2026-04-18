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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Dto.UserDTO;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService service;

    // 🔹 Create
    @PostMapping("/create")
    public User create(@RequestBody UserDTO dto) {
        return service.createUser(dto);
    }

    // 🔹 Get all
    @GetMapping("/getAll")
    public List<User> getAll() {
        return service.getAllUsers();
    }
    
    // 🔥 CLIENT USERS ONLY
    @GetMapping("/client/{orgId}")
    public List<User> getByClient(@PathVariable String orgId) {
        return service.getUsersByOrg(orgId);
    }

    // 🔹 Delete
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteUser(id);
        return "Deleted";
    }

    // 🔥 BLOCK / UNBLOCK
    @PutMapping("/toggle/{id}")
    public User toggle(@PathVariable Long id) {
        return service.toggleUserStatus(id);
    }

    // 🔥 CHANGE PASSWORD
    @PutMapping("/change-password/{id}")
    public String changePassword(@PathVariable Long id,
                                @RequestBody Map<String, String> body) {
        service.changePassword(id, body.get("password"));
        return "Password updated";
    }
}
