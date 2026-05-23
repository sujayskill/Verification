package com.ToFact.Verification.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.Department;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {

	private final DepartmentRepository departmentRepo;
	private final ClientRepository clientRepo;

	public List<Department> getAll(String orgId, String search) {
		if (search == null || search.isBlank()) {
			return departmentRepo.findByOrgIdOrderByCreatedAtDesc(orgId);
		}
		return departmentRepo.findByOrgIdAndNameContainingIgnoreCase(orgId, search);
	}

	// 🔹 CREATE
	public Department create(String name, String orgId) {

		Client client = clientRepo.findByOrgId(orgId).orElseThrow(() -> new RuntimeException("Client not found"));

		Department d = new Department();
		d.setName(name);
		d.setOrgId(orgId);
		d.setClient(client);

		return departmentRepo.save(d);
	}

	public List<Department> getByOrg(String orgId) {
		return departmentRepo.findByOrgIdOrderByCreatedAtDesc(orgId);
	}

	// 🔹 UPDATE
	public Department update(Long id, String name) {
		Department d = departmentRepo.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));

		d.setName(name);
		return departmentRepo.save(d);
	}

	public void delete(Long id) {
		departmentRepo.deleteById(id);
	}

	// 🔹 GetAll/SEARCH
	public List<Department> search(String orgId, String q) {
		if (q == null || q.isBlank()) {
			return getByOrg(orgId);
		}
		return departmentRepo.searchDepartments(orgId, q);
	}

	public List<Department> getByOrgId(String orgId) {
		return departmentRepo.findByOrgId(orgId);
	}
}