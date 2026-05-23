package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ToFact.Verification.Entity.VendorNotification;

import jakarta.transaction.Transactional;

public interface VendorNotificationsRepository extends JpaRepository<VendorNotification, Long> {

//	This method is to mark the notifications as read in DB for client level in vendor module
	@Modifying
	@Transactional
	@Query("UPDATE VendorNotification n SET n.isRead = true WHERE n.orgId = :orgId")
	void markAllAsRead(@Param("orgId") String orgId);

//	This method is to find unread notifications at client level in vendor module
	@Query("SELECT n FROM VendorNotification n WHERE n.isRead = false")
	List<VendorNotification> findUnread();

//	This method stores the count of Realtime + Persistent Notifications System of 
//	                            VerificationRequests in department level in vendor module 

	@Query("""
			SELECT n.departmentId, COUNT(n)
			FROM VendorNotification n
			WHERE n.orgId = :orgId AND n.isRead = false
			GROUP BY n.departmentId
			""")
	List<Object[]> countByDept(@Param("orgId") String orgId);

//	This method is to mark the notifications as read in DB for department level in vendor module
	@Modifying
	@Transactional
	@Query("""
			    UPDATE VendorNotification n
			    SET n.isRead = true
			    WHERE n.orgId = :orgId AND n.departmentId = :deptId
			""")
	void markDeptAsRead(@Param("orgId") String orgId, @Param("deptId") Long deptId);

//	This method stores the count of Realtime + Persistent Notifications System of 
//    						VerificationRequests in verifications list level in vendor module 		
	@Query("""
			    SELECT n.verificationId, COUNT(n)
			    FROM VendorNotification n
			    WHERE n.orgId = :orgId
			      AND n.departmentId = :deptId
			      AND n.isRead = false
			    GROUP BY n.verificationId
			""")
	List<Object[]> countByVerification(@Param("orgId") String orgId, @Param("deptId") Long deptId);

//	This method is to mark the notifications as read in DB for verifications list level in vendor module
	@Modifying
	@Transactional
	@Query("""
			    UPDATE VendorNotification n
			    SET n.isRead = true
			    WHERE n.orgId = :orgId
			      AND n.departmentId = :deptId
			      AND n.verificationId = :verificationId
			""")
	void markVerificationAsRead(@Param("orgId") String orgId, @Param("deptId") Long deptId,
			@Param("verificationId") Long verificationId);
}
