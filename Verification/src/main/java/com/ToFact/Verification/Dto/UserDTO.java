package com.ToFact.Verification.Dto;

import com.ToFact.Verification.Entity.UserRole;

import lombok.Data;

@Data
public class UserDTO {

    private String username;
    private String password;
    private UserRole role;
    
    private String orgId; // optional
}
