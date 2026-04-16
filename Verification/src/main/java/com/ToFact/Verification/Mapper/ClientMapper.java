package com.ToFact.Verification.Mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;
import com.ToFact.Verification.Dto.ClientDTO;
//import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;

@Component
public class ClientMapper {

	public Client toEntity(ClientDTO dto, String orgId) {
		return Client.builder().orgId(orgId).companyName(dto.getCompanyName()).companyType(dto.getCompanyType())
				.contactEmail(dto.getContactEmail()).contactNumber(dto.getContactNumber()).location(dto.getLocation())
				.employeeCount(dto.getEmployeeCount()).createdAt(LocalDateTime.now()).build();
	}

	public ClientDTO toDto(Client client) {
		ClientDTO dto = new ClientDTO();
		dto.setCompanyName(client.getCompanyName());
		dto.setCompanyType(client.getCompanyType());
		dto.setContactEmail(client.getContactEmail());
		dto.setContactNumber(client.getContactNumber());
		dto.setLocation(client.getLocation());
		dto.setEmployeeCount(client.getEmployeeCount());
		return dto;
	}
}