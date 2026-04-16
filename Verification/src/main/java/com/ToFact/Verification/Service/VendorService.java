package com.ToFact.Verification.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.ClientDTO;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Mapper.ClientMapper;
import com.ToFact.Verification.Repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorService {

	private final ClientRepository clientRepository;
	private final ClientMapper clientMapper;

	// 🔹 Create
	public Client createClient(ClientDTO dto) {
		long nextId = clientRepository.count() + 1;
		String orgId = String.format("TF%04d", nextId);

		Client client = clientMapper.toEntity(dto, orgId);
		return clientRepository.save(client);
	}

	// 🔹 Get All
	public List<Client> getAllClients() {
		return clientRepository.findAll();
	}

	// 🔹 Get By Id
	public Client getClientById(Long id) {
		return clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
	}

	// 🔹 Update
	public Client updateClient(Long id, ClientDTO dto) {
		Client existing = getClientById(id);

		existing.setCompanyName(dto.getCompanyName());
		existing.setCompanyType(dto.getCompanyType());
		existing.setContactEmail(dto.getContactEmail());
		existing.setContactNumber(dto.getContactNumber());
		existing.setLocation(dto.getLocation());
		existing.setEmployeeCount(dto.getEmployeeCount());

		return clientRepository.save(existing);
	}

	// 🔹 Delete
	public void deleteClient(Long id) {
		clientRepository.deleteById(id);
	}

	// 🔹 Get Client with Candidates
	public Client getClientWithCandidates(Long id) {
		return clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
	}
}
