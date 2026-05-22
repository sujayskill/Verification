package com.ToFact.Verification.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Department;
import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.DepartmentService;
import com.ToFact.Verification.Service.VendorActivityService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

	private final DepartmentService deptService;
	private final VendorActivityService verificationsReportsService;
	private final JwtUtil jwtUtil;

	private String extractOrgId(String auth) {
		String token = auth.substring(7);
		return jwtUtil.extractClaims(token).get("orgId", String.class);
	}

	@PostMapping("/create")
	public Department create(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);
		return deptService.create(body.get("name"), orgId);
	}

	@GetMapping("/getAll")
	public List<Department> getAll(@RequestHeader("Authorization") String auth,
			@RequestParam(required = false) String q) {
		return deptService.getAll(extractOrgId(auth), q);
	}

	// 🔹 UPDATE
	@PutMapping("/{id}")
	public Department update(@PathVariable Long id, @RequestBody Map<String, String> body) {
		return deptService.update(id, body.get("name"));
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		deptService.delete(id);
	}

	@GetMapping
	public List<Department> get(@RequestParam(required = false) String q,
			@RequestHeader("Authorization") String authHeader) {
		String orgId = extractOrgId(authHeader);
		return deptService.search(orgId, q);
	}
	
	
	@GetMapping("/by-org/{orgId}")
	public List<Department> getByOrg(@PathVariable String orgId) {
	    return deptService.getByOrg(orgId);
	}
	
	@GetMapping("/platform/by-org")
	public List<Department> getDepartmentsByOrg(@RequestParam String orgId) {
	    return deptService.getByOrgId(orgId);
	}

}