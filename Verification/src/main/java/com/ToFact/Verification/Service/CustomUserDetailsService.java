//package com.ToFact.Verification.Service;
//
//import java.util.List;
//
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import com.ToFact.Verification.Config.CustomUserDetails;
//import com.ToFact.Verification.Entity.User;
//import com.ToFact.Verification.Repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailsService implements UserDetailsService {
//
//	private final UserRepository userRepository;
//
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//		User user = userRepository.findByUsername(username)
//				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//		return new CustomUserDetails(user.getUsername(), user.getPassword(), user.getClientId(),
//				List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
//	}
//}