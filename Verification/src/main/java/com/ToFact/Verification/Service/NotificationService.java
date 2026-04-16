package com.ToFact.Verification.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository repo;

	public void create(String orgId, String message) {

		Notification n = new Notification();
		n.setOrgId(orgId);
		n.setMessage(message);
		n.setCreatedAt(LocalDateTime.now());

		repo.save(n);
	}

	public List<Notification> getByOrg(String orgId) {
		return repo.findByOrgIdOrderByCreatedAtDesc(orgId);
	}

	public void markAsRead(Long id) {
		Notification n = repo.findById(id).orElseThrow();
		n.setReadStatus(true);
		repo.save(n);
	}
}