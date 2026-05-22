package com.ToFact.Verification.Service;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.OrgAccount;
import com.ToFact.Verification.Repository.OrgAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrgAuthService {

	private final OrgAccountRepository repository;

	public OrgAccount register(OrgAccount org) {
		return repository.save(org);
	}

	public OrgAccount login(String username, String password) {
		OrgAccount org = repository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		if (!org.getPassword().equals(password)) {
			throw new RuntimeException("Invalid credentials");
		}

		return org;
	}
}
