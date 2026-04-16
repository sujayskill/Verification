package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Dto.ClientDTO;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Service.VendorService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class VendorController {

	private final VendorService clientService;

	// 🔹 Create
	@PreAuthorize("hasRole('VENDOR')")
	@PostMapping("/create")
	public ResponseEntity<Client> create(@RequestBody ClientDTO dto) {
		Client created = clientService.createClient(dto);
		return ResponseEntity.ok(created);
	}

	// 🔹 Get All
	@PreAuthorize("hasAnyRole('VENDOR','VENDOR_ADMIN')")
	@GetMapping("/getAll")
	public ResponseEntity<List<Client>> getAll() {
		List<Client> clients = clientService.getAllClients();
		return ResponseEntity.ok(clients);
	}

	// 🔹 Get By ID
	@PreAuthorize("hasAnyRole('VENDOR','VENDOR_ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<Client> getById(@PathVariable Long id) {
		Client client = clientService.getClientById(id);
		return ResponseEntity.ok(client);
	}

	// 🔹 Update
	@PutMapping("/update/{id}")
	@PreAuthorize("hasAnyRole('VENDOR_ADMIN')")
	public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody ClientDTO dto) {
		Client updated = clientService.updateClient(id, dto);
		return ResponseEntity.ok(updated);
	}

	// 🔹 Delete
	@PreAuthorize("hasAnyRole('VENDOR_ADMIN')")
	@DeleteMapping("/delete/{id}")
	public String delete(@PathVariable Long id) {
		clientService.deleteClient(id);
		return "Deleted";
	}
}