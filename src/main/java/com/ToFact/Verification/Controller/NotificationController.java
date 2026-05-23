package com.ToFact.Verification.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Entity.VendorNotification;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.NotificationService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService service;
	private final JwtUtil jwtUtil;

	private String extractOrgId(String authHeader) {
		String token = authHeader.substring(7);
		Claims claims = jwtUtil.extractClaims(token);
		return claims.get("orgId", String.class);
	}

	// 🔹 CLIENT - ALL
	@GetMapping("/client")
	public List<Notification> getClientNotifications(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.getByOrg(orgId);
	}

	// 🔹 CLIENT - TOP 6 (🔔 bell)
	@GetMapping("/client/top")
	public List<Notification> getTopClientNotifications(@RequestHeader("Authorization") String authHeader) {

		String orgId = extractOrgId(authHeader);
		return service.getTop6ByOrg(orgId);
	}

	// 🔹 VENDOR - ALL
	@GetMapping("/vendor")
	public List<Notification> getVendorNotifications() {
		return service.getAllVendorNotifications();
	}

	// 🔹 VENDOR - TOP 6
	@GetMapping("/vendor/top")
	public List<Notification> getTopVendorNotifications() {
		return service.getTop6VendorNotifications();
	}

	// 🔹 MARK AS READ
	@PutMapping("/read/{id}")
	public String markAsRead(@PathVariable Long id) {
		service.markAsRead(id);
		return "Marked as read";
	}
	

}