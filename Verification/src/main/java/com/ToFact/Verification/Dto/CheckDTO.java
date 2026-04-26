package com.ToFact.Verification.Dto;

import lombok.Data;

@Data
public class CheckDTO {
    private String name;
    private String status; // VERIFIED / DISCREPANCY
    private String remarks;
}
