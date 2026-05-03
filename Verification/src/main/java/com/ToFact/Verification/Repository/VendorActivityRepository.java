package com.ToFact.Verification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;

public interface VendorActivityRepository extends JpaRepository<Verification, Long> {

	long countByStatus(VerificationStatus status);

	long countByStatusIn(List<VerificationStatus> statuses);

}
