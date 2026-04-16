package com.ToFact.Verification.ClientManagement.DTO;

import java.util.List;

import com.ToFact.Verification.ClientManagement.Entity.Address;
import com.ToFact.Verification.ClientManagement.Entity.Education;
import com.ToFact.Verification.ClientManagement.Entity.Experience;

import lombok.Data;

@Data
public class CandidateDTO {

	private String firstName;
	private String lastName;
	private String email;
	private String phone;

	private Address currentAddress;
	private Address permanentAddress;

	// 🔥 MULTIPLE EDUCATIONS
	private List<Education> educations;

	// 🔥 MULTIPLE EXPERIENCES
	private List<Experience> experiences;

	private String panNumber;
	private String adharNumber;

}