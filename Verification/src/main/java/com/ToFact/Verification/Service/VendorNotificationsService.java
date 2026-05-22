package com.ToFact.Verification.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.VendorNotification;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Repository.VendorNotificationsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorNotificationsService {

	private final VendorNotificationsRepository vendorNotificationRepo;
	private final SimpMessagingTemplate messagingTemplate;

	public void pushToVendor(Verification v) {
		// ✅ SAVE notification (with department support)
		VendorNotification n = new VendorNotification();
		n.setOrgId(v.getOrgId());
		n.setVerificationId(v.getId());
		// 🔥 ADD THIS (IMPORTANT FOR DEPARTMENT FLOW)
		if (v.getDepartment() != null) {
			n.setDepartmentId(v.getDepartment().getId());
		}
		n.setRead(false);
		vendorNotificationRepo.save(n);
		// 🔥 WebSocket push
//		messagingTemplate.convertAndSend("/topic/verifications", v);
//		messagingTemplate.convertAndSend("/topic/verifications/" + v.getOrgId(), v);
//		System.out.println("🔥 PUSHING WS EVENT → " + v.getId() + " | Org: " + v.getOrgId());
//		System.out.println("WS DeptId: " + v.getDepartmentId());
	}

//	This method is to mark the notifications as read in DB
	public void markAllAsRead(String orgId) {
		vendorNotificationRepo.markAllAsRead(orgId);
	}

}