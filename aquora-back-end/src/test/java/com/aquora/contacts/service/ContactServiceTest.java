package com.aquora.contacts.service;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.exception.ResourceNotFoundException;
import com.aquora.contacts.model.Contact;
import com.aquora.contacts.repository.ContactRepository;
import com.aquora.contacts.validator.NameValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private Contact contact;
    private ContactCreateDTO contactCreateDTO;
    private MultipartFile profilePicture;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @BeforeEach
    void setUp() {
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
        assertEquals(contact.getDateOfBirth().format(DATE_FORMATTER), 
                contactDTOs.get(0).getDateOfBirth());
    }
    
    @Test
    void searchContacts_WithSearchTerm_ShouldReturnFilteredContacts() {
        // given
        String searchTerm = "Silva";
        when(contactRepository.findBySearchTerm(searchTerm)).thenReturn(Arrays.asList(contact));

        // when
        List<ContactDTO> contactDTOs = contactService.searchContacts(searchTerm);

        // then
        assertNotNull(contactDTOs);
        assertEquals(1, contactDTOs.size());
        assertEquals(contact.getId(), contactDTOs.get(0).getId());
        assertEquals(contact.getName(), contactDTOs.get(0).getName());
        verify(contactRepository).findBySearchTerm(searchTerm);
    }
    
    @Test
    void searchContacts_WithEmptySearchTerm_ShouldReturnAllContacts() {
        // given
        String searchTerm = "";
        when(contactRepository.findAll()).thenReturn(Arrays.asList(contact));

        // when
        List<ContactDTO> contactDTOs = contactService.searchContacts(searchTerm);

        // then
        assertNotNull(contactDTOs);
        assertEquals(1, contactDTOs.size());
        verify(contactRepository).findAll();
        verify(contactRepository, never()).findBySearchTerm(anyString());
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
        
        verify(contactRepository).existsByEmail(contactCreateDTO.getEmail());
        verify(contactRepository).existsByPhone(anyString());
        verify(contactRepository).save(any(Contact.class));
    }
    
    @Test
    void createContact_WithFormattedPhone_ShouldStripNonNumericCharacters() throws IOException {
        // given
        contactCreateDTO.setPhone("(11) 9 8765-4321");
        when(contactRepository.existsByEmail(anyString())).thenReturn(false);
        when(contactRepository.existsByPhone(anyString())).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenAnswer(invocation -> {
            Contact savedContact = invocation.getArgument(0);
            assertFalse(savedContact.getPhone().contains("("));
            assertFalse(savedContact.getPhone().contains(")"));
            assertFalse(savedContact.getPhone().contains("-"));
            assertFalse(savedContact.getPhone().contains(" "));
            assertEquals("11987654321", savedContact.getPhone());
            return contact;
        });

        // when
        contactService.createContact(contactCreateDTO, profilePicture);

        // then
        verify(contactRepository).save(any(Contact.class));
    }
    
    @Test
    void createContact_WithDuplicateEmail_ShouldThrowException() {
        // given
        when(contactRepository.existsByEmail(contactCreateDTO.getEmail())).thenReturn(true);

        // when/then
        Exception exception = assertThrows(IllegalArgumentException.class, () -> 
            contactService.createContact(contactCreateDTO, profilePicture)
        );
        
        assertTrue(exception.getMessage().contains("Email já está em uso"));
        verify(contactRepository, never()).save(any(Contact.class));
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
        
        verify(contactRepository).findById(1L);
    }
    
    @Test
    void getContactById_WithNonExistingId_ShouldThrowException() {
        // given
        when(contactRepository.findById(999L)).thenReturn(Optional.empty());

        // when/then
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> 
            contactService.getContactById(999L)
        );
        
        assertTrue(exception.getMessage().contains("não encontrado com id: 999"));
    }
    
    @Test
    void updateContact_ShouldUpdateContact() throws IOException {
        // given
        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));
        when(contactRepository.existsByEmailAndIdNot(anyString(), anyLong())).thenReturn(false);
        when(contactRepository.existsByPhoneAndIdNot(anyString(), anyLong())).thenReturn(false);
        
        ContactCreateDTO updateDTO = ContactCreateDTO.builder()
                .name("João Carlos Silva")
                .email("joao.silva@example.com")
                .phone("11987654321")
                .dateOfBirth("1990-01-01")
                .build();
        
        Contact updatedContact = Contact.builder()
                .id(1L)
                .name("João Carlos Silva")
                .email("joao.silva@example.com")
                .phone("11987654321")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build();
        
        when(contactRepository.save(any(Contact.class))).thenReturn(updatedContact);

        // when
        ContactDTO result = contactService.updateContact(1L, updateDTO, null);

        // then
        assertNotNull(result);
        assertEquals("João Carlos Silva", result.getName());
        verify(contactRepository).findById(1L);
        verify(contactRepository).save(any(Contact.class));
    }
    
    @Test
    void updateContact_WithNonExistingId_ShouldThrowException() {
        // given
        when(contactRepository.findById(999L)).thenReturn(Optional.empty());

        // when/then
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> 
            contactService.updateContact(999L, contactCreateDTO, null)
        );
        
        assertTrue(exception.getMessage().contains("não encontrado com id: 999"));
        verify(contactRepository, never()).save(any(Contact.class));
    }
    
    @Test
    void deleteContact_ShouldDeleteContact() {
        // given
        when(contactRepository.existsById(1L)).thenReturn(true);
        doNothing().when(contactRepository).deleteById(1L);

        // when
        contactService.deleteContact(1L);

        // then
        verify(contactRepository).existsById(1L);
        verify(contactRepository).deleteById(1L);
    }
    
    @Test
    void deleteContact_WithNonExistingId_ShouldThrowException() {
        // given
        when(contactRepository.existsById(999L)).thenReturn(false);

        // when/then
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> 
            contactService.deleteContact(999L)
        );
        
        assertTrue(exception.getMessage().contains("não encontrado com id: 999"));
        verify(contactRepository, never()).deleteById(anyLong());
    }
} 