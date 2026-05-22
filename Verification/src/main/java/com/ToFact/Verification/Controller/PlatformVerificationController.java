<<<<<<< HEAD
package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/platform/verifications")
@RequiredArgsConstructor
public class PlatformVerificationController {

//	private final VerificationService service;
//
//	// 🔥 Vendor sees all requests
//	@GetMapping
//	public List<Verification> getAll() {
//		return service.getAll();
//	}
=======
package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/platform/verifications")
@RequiredArgsConstructor
public class PlatformVerificationController {

//	private final VerificationService service;
//
//	// 🔥 Vendor sees all requests
//	@GetMapping
//	public List<Verification> getAll() {
//		return service.getAll();
//	}
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}