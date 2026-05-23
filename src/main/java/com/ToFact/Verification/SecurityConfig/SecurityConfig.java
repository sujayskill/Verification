package com.ToFact.Verification.SecurityConfig;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
				// ✅ Enable CORS
				.cors(cors -> {
				})

				// ❌ Disable CSRF
				.csrf(csrf -> csrf.disable())

				// ✅ Stateless (JWT)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// ✅ Route-level security (basic)
				.authorizeHttpRequests(auth -> auth

						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().requestMatchers("/auth/**").permitAll()
						.requestMatchers("/ws/**").permitAll()
						// ✅ ADD THIS
						.requestMatchers("/users/**").hasAnyRole("VENDOR_ADMIN", "VENDOR", "CLIENT_ADMIN")
						.requestMatchers("/users/create").hasAnyRole("VENDOR_ADMIN", "CLIENT_ADMIN")

						.requestMatchers("/clients/update").hasRole("VENDOR_ADMIN")
						.requestMatchers("/org/candidates/**").hasAnyRole("CLIENT","CLIENT_ADMIN")
						.anyRequest().authenticated())

				// ✅ JWT Filter
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// CORS (same as yours)
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(List.of("http://localhost:3000"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return source;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}