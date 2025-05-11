package com.aquora.contacts.controller;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @Operation(summary = "Listar todos os contatos", description = "Retorna uma lista de todos os contatos cadastrados")
    public ResponseEntity<List<ContactDTO>> getAllContacts(
            @RequestParam(required = false) String search) {
        
        List<ContactDTO> contacts;
        if (search != null && !search.trim().isEmpty()) {
            contacts = contactService.searchContacts(search);
        } else {
            contacts = contactService.getAllContacts();
        }
        
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar contato por ID", description = "Retorna um contato específico pelo ID")
    public ResponseEntity<ContactDTO> getContactById(@PathVariable Long id) {
        ContactDTO contact = contactService.getContactById(id);
        return ResponseEntity.ok(contact);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Criar novo contato", description = "Cria um novo contato com os dados fornecidos")
    public ResponseEntity<ContactDTO> createContact(
            @RequestPart("contact") @Valid ContactCreateDTO contactDTO,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {
        
        ContactDTO createdContact = contactService.createContact(contactDTO, profilePicture);
        return new ResponseEntity<>(createdContact, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Atualizar contato", description = "Atualiza um contato existente com os dados fornecidos")
    public ResponseEntity<ContactDTO> updateContact(
            @PathVariable Long id,
            @RequestPart("contact") @Valid ContactCreateDTO contactDTO,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {
        
        ContactDTO updatedContact = contactService.updateContact(id, contactDTO, profilePicture);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir contato", description = "Remove um contato pelo ID")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
} 