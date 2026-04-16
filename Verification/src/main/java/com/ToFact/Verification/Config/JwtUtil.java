package com.ToFact.Verification.Config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.ToFact.Verification.Entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET = "my-super-secret-key-for-jwt-1234567890";

	private Key getKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(User user) {

	    return Jwts.builder()
	            .setSubject(user.getUsername())
	            .claim("role", "ROLE_" + user.getRole().name())
	            .claim("orgId", user.getOrgId()) // ✅ ADD THIS
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
	            .signWith(getKey(), SignatureAlgorithm.HS256)
	            .compact();
	}

	public Claims extractClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()) // ✅ SAME KEY
				.build().parseClaimsJws(token).getBody();
	}
}