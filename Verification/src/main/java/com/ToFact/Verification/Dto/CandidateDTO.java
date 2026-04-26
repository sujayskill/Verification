package com.ToFact.Verification.Dto;

import java.time.LocalDate;
import java.util.List;

import com.ToFact.Verification.Entity.Address;
import com.ToFact.Verification.Entity.Education;
import com.ToFact.Verification.Entity.Experience;

import lombok.Data;

@Data
public class CandidateDTO {

	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private LocalDate dob;

	private Address currentAddress;
	private Address permanentAddress;

	// 🔥 MULTIPLE EDUCATIONS
	private List<Education> educations;

	// 🔥 MULTIPLE EXPERIENCES
	private List<Experience> experiences;

	private String panNumber;
	private String adharNumber;

}