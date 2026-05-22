package com.ToFact.Verification.Config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ToFact.Verification.Entity.User;
import com.ToFact.Verification.Repository.UserRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepo;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			try {
				String token = authHeader.substring(7);
				Claims claims = jwtUtil.extractClaims(token);

				String username = claims.getSubject();
				String role = claims.get("role", String.class);
				String orgId = claims.get("orgId", String.class);

				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
						List.of(new SimpleGrantedAuthority(role)));

				// 🔥 Attach extra details
				User user = userRepo.findByUsername(username).orElse(null);

				if (user != null && !user.isActive()) {
					response.setStatus(HttpServletResponse.SC_FORBIDDEN);
					response.getWriter().write("User is blocked");
					return;
				}
				auth.setDetails(orgId);

				SecurityContextHolder.getContext().setAuthentication(auth);

			} catch (Exception e) {
				System.out.println("JWT ERROR: " + e.getMessage());
			}
		}

		filterChain.doFilter(request, response);
	}
}