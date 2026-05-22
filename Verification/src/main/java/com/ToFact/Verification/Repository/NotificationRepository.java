<<<<<<< HEAD
package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Entity.NotificationType;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByOrgIdOrderByCreatedAtDesc(String orgId);

	List<Notification> findTop6ByOrgIdOrderByCreatedAtDesc(String orgId);

	List<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type);

	List<Notification> findTop6ByTypeOrderByCreatedAtDesc(NotificationType type);
	
	List<Notification> findByOrgIdOrderByCreatedAtAsc(String orgId);

	List<Notification> findByTypeOrderByCreatedAtAsc(NotificationType type);
=======
package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Entity.NotificationType;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByOrgIdOrderByCreatedAtDesc(String orgId);

	List<Notification> findTop6ByOrgIdOrderByCreatedAtDesc(String orgId);

	List<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type);

	List<Notification> findTop6ByTypeOrderByCreatedAtDesc(NotificationType type);
	
	List<Notification> findByOrgIdOrderByCreatedAtAsc(String orgId);

	List<Notification> findByTypeOrderByCreatedAtAsc(NotificationType type);
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}