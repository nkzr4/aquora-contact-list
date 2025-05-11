package com.aquora.contacts.service;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.model.Contact;
import com.aquora.contacts.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private Contact contact;
    private ContactCreateDTO contactCreateDTO;
    private MultipartFile profilePicture;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        contact = Contact.builder()
                .id(1L)
                .name("João Silva")
                .email("joao.silva@example.com")
                .phone("11987654321")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build();

        contactCreateDTO = ContactCreateDTO.builder()
                .name("João Silva")
                .email("joao.silva@example.com")
                .phone("11987654321")
                .dateOfBirth("1990-01-01")
                .build();

        profilePicture = new MockMultipartFile(
                "profilePicture", 
                "avatar.jpg", 
                "image/jpeg", 
                "test image content".getBytes());
    }

    @Test
    void getAllContacts_ShouldReturnAllContacts() {
        // given
        when(contactRepository.findAll()).thenReturn(Arrays.asList(contact));

        // when
        List<ContactDTO> contactDTOs = contactService.getAllContacts();

        // then
        assertNotNull(contactDTOs);
        assertEquals(1, contactDTOs.size());
        assertEquals(contact.getId(), contactDTOs.get(0).getId());
        assertEquals(contact.getName(), contactDTOs.get(0).getName());
        assertEquals(contact.getEmail(), contactDTOs.get(0).getEmail());
        assertEquals(contact.getPhone(), contactDTOs.get(0).getPhone());
        assertEquals(contact.getDateOfBirth().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), 
                contactDTOs.get(0).getDateOfBirth());
    }

    @Test
    void createContact_ShouldCreateContact() throws IOException {
        // given
        when(contactRepository.existsByEmail(anyString())).thenReturn(false);
        when(contactRepository.existsByPhone(anyString())).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        // when
        ContactDTO createdContact = contactService.createContact(contactCreateDTO, profilePicture);

        // then
        assertNotNull(createdContact);
        assertEquals(contact.getId(), createdContact.getId());
        assertEquals(contact.getName(), createdContact.getName());
        assertEquals(contact.getEmail(), createdContact.getEmail());
        assertEquals(contact.getPhone(), createdContact.getPhone());
        
        verify(contactRepository, times(1)).existsByEmail(contactCreateDTO.getEmail());
        verify(contactRepository, times(1)).existsByPhone(contactCreateDTO.getPhone());
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void getContactById_ShouldReturnContact() {
        // given
        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));

        // when
        ContactDTO contactDTO = contactService.getContactById(1L);

        // then
        assertNotNull(contactDTO);
        assertEquals(contact.getId(), contactDTO.getId());
        assertEquals(contact.getName(), contactDTO.getName());
        assertEquals(contact.getEmail(), contactDTO.getEmail());
        assertEquals(contact.getPhone(), contactDTO.getPhone());
        
        verify(contactRepository, times(1)).findById(1L);
    }
} 