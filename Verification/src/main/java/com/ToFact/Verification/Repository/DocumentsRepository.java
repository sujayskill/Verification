<<<<<<< HEAD
package com.ToFact.Verification.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Documents;

public interface DocumentsRepository extends JpaRepository<Documents, Long> {

    List<Documents> findByCandidateId(Long candidateId);
}
=======
package com.ToFact.Verification.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ToFact.Verification.Entity.Documents;

public interface DocumentsRepository extends JpaRepository<Documents, Long> {

    List<Documents> findByCandidateId(Long candidateId);
}
>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
