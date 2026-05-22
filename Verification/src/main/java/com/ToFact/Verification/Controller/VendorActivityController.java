package com.ToFact.Verification.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Entity.VerificationStatus;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.VendorActivityRepository;
import com.ToFact.Verification.Repository.VerificationRepository;
import com.ToFact.Verification.Service.CandidateService;
import com.ToFact.Verification.Service.VendorActivityService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/vendor")
@RequiredArgsConstructor
public class VendorActivityController {

	private final CandidateService candidateService;
	private final VendorActivityService verificationReportsservice;
	private final CandidateRepository candidateRepository;
	private final VerificationRepository verificationRepo;
	private final VendorActivityRepository verificationVendorActivityRepo;
	private final ClientRepository clientRepo;

	@GetMapping("/dashboard")
	public Map<String, Object> getDashboardStats() {
		Map<String, Object> res = new HashMap<>();

		res.put("totalClients", clientRepo.count());
		res.put("activeClients", clientRepo.countByIsActiveTrue());
		res.put("totalVerifications", verificationRepo.count());
<<<<<<< HEAD

		res.put("inProgress",
				verificationVendorActivityRepo
						.countByStatusIn(List.of(VerificationStatus.INITIATED, VerificationStatus.IN_PROGRESS,
								VerificationStatus.ROLLBACK_REQUESTED, VerificationStatus.ROLLED_BACK)));

		res.put("completed", verificationVendorActivityRepo.countByStatus(VerificationStatus.COMPLETED));

		return res;
	}

	@GetMapping("/client/candidates/{id}")
	public Candidate getById(@PathVariable Long id) {
		return candidateRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
	}

	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@PutMapping("/client/candidates/{id}")
	public Candidate update(@PathVariable Long id, @RequestBody Candidate dto) {

		Candidate c = candidateRepository.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔹 BASIC
		c.setFirstName(dto.getFirstName());
		c.setLastName(dto.getLastName());
		c.setEmail(dto.getEmail());
		c.setPhone(dto.getPhone());
		c.setDob(dto.getDob());

		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());

		if (c.getEducations() == null) {
			c.setEducations(new ArrayList<>());
		}
		if (c.getExperiences() == null) {
			c.setExperiences(new ArrayList<>());
		}

		// 🔥 EDUCATION (RESET + REATTACH)
		c.getEducations().clear();
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(c));
			c.getEducations().addAll(dto.getEducations());
		}

		// 🔥 EXPERIENCE (RESET + REATTACH)
		c.getExperiences().clear();
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(exp -> exp.setCandidate(c));
			c.getExperiences().addAll(dto.getExperiences());
		}

		return candidateRepository.save(c);
	}

	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@DeleteMapping("/client/candidates/{id}")
	public void delete(@PathVariable Long id) {
		candidateRepository.deleteById(id);
	}

	@GetMapping("/platform/candidates/by-department")
	public List<Candidate> getCandidates(@RequestParam String orgId, @RequestParam Long deptId,
			@RequestParam(required = false) String q) {
		return candidateService.getCandidatesByDept(orgId, deptId, q);
	}

//	This method is to fetch the list of verification requests by client wise in verifications section at vendor module
	@GetMapping("/platform/verifications/by-client")
	public List<Verification> getByClient(@RequestParam String orgId, @RequestParam(required = false) String q) {
		return verificationReportsservice.getByClientForVerification(orgId, q);
	}

//	This method is to fetch the list of verifications by client wise in status section at vendor module
	@GetMapping("/platform/verifications/by-org")
	public List<Verification> getByOrg(@RequestParam String orgId, @RequestParam(required = false) String q) {
		return verificationReportsservice.getByClientForStatus(orgId, q);
	}

//	This method is to list the candidates by client in reports section at vendor module
	@GetMapping("/platform/verifications/reports/by-org")
	public List<Verification> getReportsByOrg(@RequestParam String orgId) {
		return verificationReportsservice.getReportsByOrg(orgId);
	}

//	/------------------------------------------------------------ EXTRAS --------------------------------------------------------------------------/

//	This method is used to filter the candidates by department in verification sections for vendor module  
=======
		
		res.put("inProgress", verificationVendorActivityRepo
				.countByStatusIn(List.of(VerificationStatus.INITIATED, VerificationStatus.IN_PROGRESS, VerificationStatus.ROLLBACK_REQUESTED, VerificationStatus.ROLLED_BACK)));
		
		res.put("completed", verificationVendorActivityRepo.countByStatus(VerificationStatus.COMPLETED));

		return res;
	}

	@GetMapping("/client/candidates/{id}")
	public Candidate getById(@PathVariable Long id) {
		return candidateRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
	}

	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@PutMapping("/client/candidates/{id}")
	public Candidate update(@PathVariable Long id, @RequestBody Candidate dto) {

		Candidate c = candidateRepository.findById(id).orElseThrow(() -> new RuntimeException("Candidate not found"));

		// 🔹 BASIC
		c.setFirstName(dto.getFirstName());
		c.setLastName(dto.getLastName());
		c.setEmail(dto.getEmail());
		c.setPhone(dto.getPhone());
		c.setDob(dto.getDob());

		// 🔹 ADDRESS
		c.setCurrentAddress(dto.getCurrentAddress());
		c.setPermanentAddress(dto.getPermanentAddress());
		
		if (c.getEducations() == null) {
		    c.setEducations(new ArrayList<>());
		}
		if (c.getExperiences() == null) {
		    c.setExperiences(new ArrayList<>());
		}

		// 🔥 EDUCATION (RESET + REATTACH)
		c.getEducations().clear();
		if (dto.getEducations() != null) {
			dto.getEducations().forEach(e -> e.setCandidate(c));
			c.getEducations().addAll(dto.getEducations());
		}

		// 🔥 EXPERIENCE (RESET + REATTACH)
		c.getExperiences().clear();
		if (dto.getExperiences() != null) {
			dto.getExperiences().forEach(exp -> exp.setCandidate(c));
			c.getExperiences().addAll(dto.getExperiences());
		}

		return candidateRepository.save(c);
	}

	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@DeleteMapping("/client/candidates/{id}")
	public void delete(@PathVariable Long id) {
		candidateRepository.deleteById(id);
	}

	@GetMapping("/platform/candidates/by-department")
	public List<Candidate> getCandidates(@RequestParam String orgId, @RequestParam Long deptId,
			@RequestParam(required = false) String q) {
		return candidateService.getCandidatesByDept(orgId, deptId, q);
	}

>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
	@GetMapping("/platform/verifications/by-department")
	public List<Verification> getByDept(@RequestParam String orgId, @RequestParam Long deptId,
			@RequestParam(required = false) String q) {
		return verificationReportsservice.getByOrgAndDept(orgId, deptId, q);
	}

//	This method is to list the candidates by department in reports section at vendor module
	@GetMapping("/platform/verifications/reports/by-department")
	public List<Verification> getReportsByDept(@RequestParam String orgId, @RequestParam Long deptId) {
		return verificationReportsservice.getReportsByDept(orgId, deptId);
	}
}
