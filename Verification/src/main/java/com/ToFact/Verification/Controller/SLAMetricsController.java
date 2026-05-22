package com.ToFact.Verification.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.Entity.Verification;
import com.ToFact.Verification.Service.SLAMetricsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/SLA")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SLAMetricsController {
	
	private final SLAMetricsService service;
	
	@GetMapping("/metrics/sla")
	public List<Verification> getSlaMetrics() {
	    return service.getAllForMetrics();
	}

}
