package com.ToFact.Verification.ClientManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.ClientManagement.Entity.Education;

public interface EducationRepository extends JpaRepository<Education, Long> {

}
