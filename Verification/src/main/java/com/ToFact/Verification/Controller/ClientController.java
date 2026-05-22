package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Dto.ClientDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Repository.ClientRepository;
import com.ToFact.Verification.Service.ClientService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

	private final ClientService clientService;
	private final ClientRepository clientRepo;

	// 🔹 Create
	@PreAuthorize("hasole('VENDOR_ADMIN')")
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
	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@PutMapping("/update/{id}")
	public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody ClientDTO dto) {
		Client updated = clientService.updateClient(id, dto);
		return ResponseEntity.ok(updated);
	}

	// 🔹 Delete
	@PreAuthorize("hasRole('VENDOR_ADMIN')")
	@DeleteMapping("/delete/{id}")
	public String delete(@PathVariable Long id) {
		clientService.deleteClient(id);
		return "Deleted";
	}

	@PreAuthorize("hasAnyRole('VENDOR','VENDOR_ADMIN')")
	@GetMapping("/search")
	public List<Client> searchClients(@RequestParam(required = false) String q,
			@RequestParam(required = false) String location, @RequestParam(required = false) Integer size) {
		return clientService.searchClients(q, location, size);
	}

//	This is for search & group the candidates by client in vendor client's candidates section
//	http://localhost:8081/clients/1/candidates/search
	@PreAuthorize("hasAnyRole('VENDOR','VENDOR_ADMIN')")
	@GetMapping("/{clientId}/candidates/search")
	public List<Candidate> searchCandidates(@PathVariable Long clientId, @RequestParam(required = false) String q) {
		return clientService.getCandidatesByClientId(clientId, q);
	}
	
	@PreAuthorize("hasAnyRole('VENDOR','VENDOR_ADMIN')")
	@GetMapping("/by-org/{orgId}")
	public ResponseEntity<Client> getByOrgId(@PathVariable String orgId) {
	    Client client = clientRepo.findByOrgId(orgId)
	            .orElseThrow(() -> new RuntimeException("Client not found"));
	    return ResponseEntity.ok(client);
	}

}