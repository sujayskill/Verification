package com.ToFact.Verification.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.Entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByOrgIdOrderByCreatedAtDesc(String orgId);
}