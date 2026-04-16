package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Config.JwtUtil;
import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService service;
	private final JwtUtil jwtUtil;

	@GetMapping
	public List<Notification> get(@RequestHeader("Authorization") String authHeader) {

		String token = authHeader.substring(7);
		String orgId = jwtUtil.extractClaims(token).get("orgId", String.class);

		return service.getByOrg(orgId);
	}

	@PutMapping("/{id}/read")
	public void markRead(@PathVariable Long id) {
		service.markAsRead(id);
	}
}