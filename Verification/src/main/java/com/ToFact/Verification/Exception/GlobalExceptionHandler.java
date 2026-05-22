<<<<<<< HEAD
package com.ToFact.Verification.Exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(Map.of("error", ex.getMessage()));
//    }

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {

		if ("TOKEN_EXPIRED".equals(ex.getMessage())) {
			return ResponseEntity.status(401)
					.body(Map.of("error", "TOKEN_EXPIRED", "message", "Session expired. Please login again."));
		}

		return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGeneric(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Something went wrong"));
	}

=======
package com.ToFact.Verification.Exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(Map.of("error", ex.getMessage()));
//    }

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {

		if ("TOKEN_EXPIRED".equals(ex.getMessage())) {
			return ResponseEntity.status(401)
					.body(Map.of("error", "TOKEN_EXPIRED", "message", "Session expired. Please login again."));
		}

		return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGeneric(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Something went wrong"));
	}

>>>>>>> branch 'master' of https://github.com/sujayskill/Verification
}