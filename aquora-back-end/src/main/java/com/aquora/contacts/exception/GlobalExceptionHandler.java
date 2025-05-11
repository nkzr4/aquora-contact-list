package com.aquora.contacts.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
            ResourceNotFoundException exception, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                request.getDescription(false));
        
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDetails> handleIllegalArgumentException(
            IllegalArgumentException exception, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                request.getDescription(false));
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
    
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, 
            HttpStatus status, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse errorDetails = new ValidationErrorResponse(
                LocalDateTime.now(),
                "Erro de validação",
                request.getDescription(false),
                errors);
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(
            Exception exception, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                request.getDescription(false));
        
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 