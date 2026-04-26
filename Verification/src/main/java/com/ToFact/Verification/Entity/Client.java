package com.ToFact.Verification.Entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String orgId; // TF0001

	private String companyName;
	private String companySlug; // unique URL identifier
	private String companyType;
	private String contactEmail;
	private String contactNumber;	
	private String location;
	private String employeeCount;

	@Column(name = "created_at", nullable = false)
	@JsonFormat(pattern = "dd-MM-yyyy HH:mm")
	private LocalDateTime createdAt;

	// 🔥 RELATION (1 CLIENT → MANY CANDIDATES)
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Candidate> candidates;

}