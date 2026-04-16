package com.ToFact.Verification.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.ClientManagement.Entity.OrgAccount;
import com.ToFact.Verification.ClientManagement.Service.OrgAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org/auth")
@RequiredArgsConstructor
public class OrgAuthController {

	private final OrgAuthService service;

	@PostMapping("/register")
	public OrgAccount register(@RequestBody OrgAccount org) {
		return service.register(org);
	}

	@GetMapping("/hello")
	public String hello() {
		return "Hello";
	}

	@PostMapping("/login")
	public OrgAccount login(@RequestBody OrgAccount org) {
		return service.login(org.getUsername(), org.getPassword());
	}
}