package com.ToFact.Verification.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SLAMetricsService {

	private final VerificationRepository repo;

	public List<Verification> getAllForMetrics() {
		List<Verification> list = repo.findAll();

		list.forEach(v -> {
			if (v.getCreatedAt() != null) {
				LocalDateTime deadline = v.getCreatedAt().plusDays(7);
				v.setSlaDeadline(deadline);
				v.setSlaBreached(LocalDateTime.now().isAfter(deadline));
			}
		});

		return list;
	}

}
