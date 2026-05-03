package com.ToFact.Verification.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ToFact.Verification.Dto.ClientDTO;
import com.ToFact.Verification.Entity.Candidate;
import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Mapper.ClientMapper;
import com.ToFact.Verification.Repository.CandidateRepository;
import com.ToFact.Verification.Repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientService {

	private final ClientRepository clientRepository;
	private final CandidateRepository candidateRepo;
	private final ClientMapper clientMapper;

	// 🔹 Create
	public Client createClient(ClientDTO dto) {
		long nextId = clientRepository.count() + 1;
		String orgId = String.format("TF%04d", nextId);

		Client client = clientMapper.toEntity(dto, orgId);
		client.setCompanySlug(generateSlug(client.getCompanyName()));
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
		Client existing = clientRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Client not found"));

		existing.setCompanyName(dto.getCompanyName());
		existing.setCompanySlug(generateSlug(dto.getCompanyName()));
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

//	Creating Slug for custom URL in client module(clients's company name in URL) 
	private String generateSlug(String companyName) {
		return companyName.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
	}

//	This is for search clients in vendor client's section
	public List<Client> searchClients(String q, String location, Integer size) {

	    // default empty string for LIKE
	    String query = (q == null) ? "" : q;

	    return clientRepository.searchClients(query, location, size);
	}

//	This is for search & group the candidates by client in vendor client's candidates section
	public List<Candidate> getCandidatesByClientId(Long clientId, String q) {

	    if (q == null || q.isBlank()) {
	        return candidateRepo.findByClient_Id(clientId);
	    }
	    return candidateRepo.searchByClientId(clientId, q);
	}
}
