package com.aquora.contacts.controller;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.dto.PagedResponse;
import com.aquora.contacts.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/contacts")
@Tag(name = "Contatos", description = "API para gerenciamento de contatos")
@Slf4j
public class ContactController {

    private final ContactService contactService;
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int DEFAULT_PAGE_NUMBER = 0;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @Operation(summary = "Listar contatos", description = "Retorna uma lista paginada de contatos")
    public ResponseEntity<?> getContacts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("GET /contacts - Listando contatos. Search: {}, Page: {}, Size: {}", search, page, size);
        
        if (page < 0) {
            page = DEFAULT_PAGE_NUMBER;
        }
        
        if (size <= 0) {
            size = DEFAULT_PAGE_SIZE;
        }
        
        PagedResponse<ContactDTO> response;
        if (search != null && !search.trim().isEmpty()) {
            log.info("Buscando contatos com termo: '{}'", search);
            response = contactService.searchContactsPaged(search, page, size);
        } else {
            log.info("Listando todos os contatos");
            response = contactService.getAllContactsPaged(page, size);
        }
        
        log.info("Retornando {} contatos (página {} de {})", 
                response.getContent().size(), response.getPageNumber() + 1, response.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar contato por ID", description = "Retorna um contato específico pelo ID")
    public ResponseEntity<ContactDTO> getContactById(@PathVariable Long id) {
        log.info("GET /contacts/{} - Buscando contato por ID", id);
        ContactDTO contact = contactService.getContactById(id);
        log.info("Contato encontrado com ID {}: {}", id, contact.getName());
        return ResponseEntity.ok(contact);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Criar novo contato", 
        description = "Cria um novo contato com os dados fornecidos"
    )
    public ResponseEntity<ContactDTO> createContact(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("dateOfBirth") String dateOfBirth,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {
        
        log.info("POST /contacts - Criando novo contato");
        log.info("Dados recebidos: name={}, email={}, phone={}, dateOfBirth={}, hasPicture={}", 
                name, email, phone, dateOfBirth, (profilePicture != null && !profilePicture.isEmpty()));
        
        ContactCreateDTO contactDTO = ContactCreateDTO.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .dateOfBirth(dateOfBirth)
                .build();
        
        try {
            ContactDTO createdContact = contactService.createContact(contactDTO, profilePicture);
            log.info("Contato criado com sucesso. ID: {}, Nome: {}", createdContact.getId(), createdContact.getName());
            return new ResponseEntity<>(createdContact, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Erro ao criar contato: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Atualizar contato", 
        description = "Atualiza um contato existente com os dados fornecidos"
    )
    public ResponseEntity<ContactDTO> updateContact(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("dateOfBirth") String dateOfBirth,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {
        
        log.info("PUT /contacts/{} - Atualizando contato", id);
        log.info("Dados recebidos: name={}, email={}, phone={}, dateOfBirth={}, hasPicture={}", 
                name, email, phone, dateOfBirth, (profilePicture != null && !profilePicture.isEmpty()));
        
        ContactCreateDTO contactDTO = ContactCreateDTO.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .dateOfBirth(dateOfBirth)
                .build();
        
        try {
            ContactDTO updatedContact = contactService.updateContact(id, contactDTO, profilePicture);
            log.info("Contato atualizado com sucesso. ID: {}, Nome: {}", updatedContact.getId(), updatedContact.getName());
            return ResponseEntity.ok(updatedContact);
        } catch (Exception e) {
            log.error("Erro ao atualizar contato: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir contato", description = "Remove um contato pelo ID")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        log.info("DELETE /contacts/{} - Excluindo contato", id);
        contactService.deleteContact(id);
        log.info("Contato excluído com sucesso. ID: {}", id);
        return ResponseEntity.noContent().build();
    }
} 