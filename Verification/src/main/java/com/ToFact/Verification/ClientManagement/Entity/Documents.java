package com.ToFact.Verification.ClientManagement.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Documents {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fileName;

	@Enumerated(EnumType.STRING)
	private DocumentType fileType;

	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] data; // 🔥 FILE STORED IN DB

	private String contentType; // image/png, application/pdf

	private LocalDateTime uploadedAt;

	// 🔗 RELATIONS
	@ManyToOne
	@JoinColumn(name = "candidate_id")
	@JsonIgnore
	private Candidate candidate;

	@ManyToOne
	@JoinColumn(name = "education_id")
	@JsonIgnore
	private Education education;

	@ManyToOne
	@JoinColumn(name = "experience_id")
	@JsonIgnore
	private Experience experience;
}