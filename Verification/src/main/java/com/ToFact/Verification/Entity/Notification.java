<<<<<<< HEAD
package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String orgId;

	private String message;

	@Column(name = "is_read", nullable = false)
	private boolean read = false;

	@Enumerated(EnumType.STRING)
	private NotificationType type;

	@Column(name = "created_at", nullable = false)
	@JsonFormat(pattern = "dd-MM-yyyy HH:mm")
	private LocalDateTime createdAt = LocalDateTime.now();

}
=======
package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String orgId;

	private String message;

	@Column(name = "is_read", nullable = false)
	private boolean read = false;

	@Enumerated(EnumType.STRING)
	private NotificationType type;

	@Column(name = "created_at", nullable = false)
	@JsonFormat(pattern = "dd-MM-yyyy HH:mm")
	private LocalDateTime createdAt = LocalDateTime.now();

}
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
