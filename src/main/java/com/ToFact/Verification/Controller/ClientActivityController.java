package com.ToFact.Verification.Controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ToFact.Verification.SecurityConfig.JwtUtil;
import com.ToFact.Verification.Service.ClientActivityService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientActivityController {

	

}
