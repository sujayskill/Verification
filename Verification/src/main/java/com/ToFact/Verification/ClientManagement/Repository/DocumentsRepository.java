package com.ToFact.Verification.ClientManagement.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ToFact.Verification.ClientManagement.Entity.Documents;

public interface DocumentsRepository extends JpaRepository<Documents, Long> {

    List<Documents> findByCandidateId(Long candidateId);
}
