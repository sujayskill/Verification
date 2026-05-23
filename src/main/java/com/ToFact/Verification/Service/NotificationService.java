package com.ToFact.Verification.Service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Notification;
import com.ToFact.Verification.Entity.NotificationType;
import com.ToFact.Verification.Repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;
    private final SimpMessagingTemplate messagingTemplate;

    // 🔹 SEND TO CLIENT
    public void sendToClient(String orgId, String message) {

        Notification n = new Notification();
        n.setOrgId(orgId);
        n.setMessage(message);
        n.setType(NotificationType.CLIENT);

        repo.save(n);

        // 🔥 REAL-TIME PUSH
        messagingTemplate.convertAndSend("/topic/client/" + orgId, n);
    }

    // 🔹 SEND TO VENDOR
    public void sendToVendor(String message) {

        Notification n = new Notification();
        n.setMessage(message);
        n.setType(NotificationType.VENDOR);

        repo.save(n);

        messagingTemplate.convertAndSend("/topic/vendor", n);
    }

    // 🔹 CLIENT - ALL
    public List<Notification> getByOrg(String orgId) {
        return repo.findByOrgIdOrderByCreatedAtDesc(orgId);
    }

    // 🔹 CLIENT - TOP 6 (for bell)
    public List<Notification> getTop6ByOrg(String orgId) {
        return repo.findTop6ByOrgIdOrderByCreatedAtDesc(orgId);
    }

    // 🔹 VENDOR - ALL
    public List<Notification> getAllVendorNotifications() {
        return repo.findByTypeOrderByCreatedAtDesc(NotificationType.VENDOR);
    }

    // 🔹 VENDOR - TOP 6
    public List<Notification> getTop6VendorNotifications() {
        return repo.findTop6ByTypeOrderByCreatedAtDesc(NotificationType.VENDOR);
    }

    // 🔹 MARK AS READ
    public void markAsRead(Long id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setRead(true);
        repo.save(n);
    }
}