package com.aquora.contacts.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class MultipartExceptionHandler {

    @ExceptionHandler({MultipartException.class, MaxUploadSizeExceededException.class})
    public ResponseEntity<ErrorDetails> handleMultipartException(Exception ex, WebRequest request) {
        log.error("Erro ao processar upload de arquivo", ex);
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                "Erro ao processar upload de arquivo: " + ex.getMessage(),
                request.getDescription(false));
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
} 