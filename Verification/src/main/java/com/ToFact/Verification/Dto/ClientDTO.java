package com.ToFact.Verification.Dto;
import lombok.Data;

@Data
public class ClientDTO {

    private String companyName;
	private String companySlug; // unique URL identifier
    private String companyType;
    private String contactEmail;
    private String contactNumber;
    private String location;
    private String employeeCount;
    // getters and setters
    
    
}
