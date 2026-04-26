package com.ToFact.Verification.Config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ToFact.Verification.Entity.Client;
import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Entity.UserRole;
import com.ToFact.Verification.Repository.ClientRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET = "my-super-secret-key-for-jwt-1234567890";
	@Autowired
	private ClientRepository clientRepository;

	private Key getKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(User user) {

		String slug = null;

		// ✅ ONLY FOR CLIENT USERS
		if (user.getRole() == UserRole.CLIENT || user.getRole() == UserRole.CLIENT_ADMIN) {
			Client client = clientRepository.findByOrgId(user.getOrgId())
					.orElseThrow(() -> new RuntimeException("Client not found"));

			slug = client.getCompanySlug();
		}

		return Jwts.builder().setSubject(user.getUsername()).claim("role", "ROLE_" + user.getRole().name())
				.claim("orgId", user.getOrgId()).claim("slug", slug) // can be null for vendor
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 2))
				.signWith(getKey(), SignatureAlgorithm.HS256).compact();
	}

	public Claims extractClaims(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			throw new RuntimeException("TOKEN_EXPIRED");
		}
	}
}