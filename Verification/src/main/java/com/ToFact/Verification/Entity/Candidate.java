package com.ToFact.Verification.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private String countryCode;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate dob;
	

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "current_address_id")
	private Address currentAddress;

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "permanent_address_id")
	private Address permanentAddress;

	@OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Education> educations;

	@OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Experience> experiences;

	@OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
	private List<Documents> documents; // only for PAN/Aadhar

	@Enumerated(EnumType.STRING)
	private ClientVerificationStatus status;

	// 🔥 RELATION (MANY → ONE CLIENT)
	@ManyToOne
	@JoinColumn(name = "client_id")
	@JsonIgnoreProperties({"candidates"})
	private Client client;
	
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
	
	private boolean locked = false;

}
