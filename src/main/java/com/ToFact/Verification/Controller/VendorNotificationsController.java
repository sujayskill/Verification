package com.ToFact.Verification.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.VendorNotification;
import com.ToFact.Verification.Repository.VendorNotificationsRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/vendor/notifications")
@RequiredArgsConstructor
public class VendorNotificationsController {

	private final VendorNotificationsRepository vendorNotificationsRepo;
	private static final Logger log = LoggerFactory.getLogger(VendorNotificationsController.class);

//	This method stores the Realtime + Persistent Notifications System of VerificationRequests  
	@GetMapping("/count")
	public Map<String, Long> getUnreadCounts() {
		System.out.println("client notification count controller");
		return vendorNotificationsRepo.findUnread().stream()
				.collect(Collectors.groupingBy(VendorNotification::getOrgId, Collectors.counting()));
	}

//	This method is to mark the notifications as read in DB
	@PutMapping("/mark-read/{orgId}")
	public void markRead(@PathVariable String orgId) {
		vendorNotificationsRepo.markAllAsRead(orgId);
	}

//	This method stores the count of Realtime + Persistent Notifications System of 
//    							VerificationRequests in department level in vendor module 
	@GetMapping("/count/departments")
	public Map<Long, Long> getDeptCounts(@RequestParam String orgId) throws JsonProcessingException {
		List<Object[]> list = vendorNotificationsRepo.countByDept(orgId);

		Map<Long, Long> map = new HashMap<>();

		for (Object[] row : list) {
			map.put((Long) row[0], (Long) row[1]);
		}

		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(map);
		log.info("Department notification count controller response: {}", json);
		return map;
	}

//	This method is to mark the notifications as read in DB for department level in vendor module
	@PutMapping("/mark-read/{orgId}/{deptId}")
	public void markDeptRead(@PathVariable String orgId, @PathVariable Long deptId) {
		vendorNotificationsRepo.markDeptAsRead(orgId, deptId);
	}

//	This method stores the count of Realtime + Persistent Notifications System of 
//								VerificationRequests in verifications list level in vendor module
	@GetMapping("/count/verifications")
	public Map<Long, Long> getVerificationCounts(@RequestParam String orgId, @RequestParam Long deptId) {
		List<Object[]> list = vendorNotificationsRepo.countByVerification(orgId, deptId);

		Map<Long, Long> map = new HashMap<>();

		for (Object[] row : list) {
			map.put((Long) row[0], (Long) row[1]);
		}

		return map;
	}

//	This method is to mark the notifications as read in DB for verifications list level in vendor module
	@PutMapping("/mark-read/{orgId}/{deptId}/verification/{verificationId}")
	public void markVerificationRead(@PathVariable String orgId, @PathVariable Long deptId,
			@PathVariable Long verificationId) {
		vendorNotificationsRepo.markVerificationAsRead(orgId, deptId, verificationId);
	}

}
