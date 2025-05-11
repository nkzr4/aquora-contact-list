package com.aquora.contacts.service;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.exception.ResourceNotFoundException;
import com.aquora.contacts.model.Contact;
import com.aquora.contacts.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<ContactDTO> getAllContacts() {
        return contactRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ContactDTO> searchContacts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllContacts();
        }
        
        return contactRepository.findBySearchTerm(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ContactDTO getContactById(Long id) {
        Contact contact = findContactById(id);
        return convertToDTO(contact);
    }

    @Transactional
    public ContactDTO createContact(ContactCreateDTO contactDTO, MultipartFile profilePicture) throws IOException {
        validateUniqueFields(contactDTO.getEmail(), contactDTO.getPhone(), null);
        
        Contact contact = Contact.builder()
                .name(contactDTO.getName())
                .email(contactDTO.getEmail())
                .phone(contactDTO.getPhone())
                .dateOfBirth(LocalDate.parse(contactDTO.getDateOfBirth(), DATE_FORMATTER))
                .build();

        if (profilePicture != null && !profilePicture.isEmpty()) {
            contact.setProfilePicture(profilePicture.getBytes());
            contact.setProfilePictureType(profilePicture.getContentType());
        }

        Contact savedContact = contactRepository.save(contact);
        return convertToDTO(savedContact);
    }

    @Transactional
    public ContactDTO updateContact(Long id, ContactCreateDTO contactDTO, MultipartFile profilePicture) throws IOException {
        Contact existingContact = findContactById(id);
        
        validateUniqueFields(contactDTO.getEmail(), contactDTO.getPhone(), id);

        existingContact.setName(contactDTO.getName());
        existingContact.setEmail(contactDTO.getEmail());
        existingContact.setPhone(contactDTO.getPhone());
        existingContact.setDateOfBirth(LocalDate.parse(contactDTO.getDateOfBirth(), DATE_FORMATTER));

        if (profilePicture != null && !profilePicture.isEmpty()) {
            existingContact.setProfilePicture(profilePicture.getBytes());
            existingContact.setProfilePictureType(profilePicture.getContentType());
        }

        Contact updatedContact = contactRepository.save(existingContact);
        return convertToDTO(updatedContact);
    }

    @Transactional
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contato não encontrado com id: " + id);
        }
        contactRepository.deleteById(id);
    }

    private Contact findContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com id: " + id));
    }

    private void validateUniqueFields(String email, String phone, Long id) {
        if (id == null) {
            if (contactRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email já está em uso");
            }
            if (contactRepository.existsByPhone(phone)) {
                throw new IllegalArgumentException("Telefone já está em uso");
            }
        } else {
            if (contactRepository.existsByEmailAndIdNot(email, id)) {
                throw new IllegalArgumentException("Email já está em uso");
            }
            if (contactRepository.existsByPhoneAndIdNot(phone, id)) {
                throw new IllegalArgumentException("Telefone já está em uso");
            }
        }
    }

    private ContactDTO convertToDTO(Contact contact) {
        String profilePictureBase64 = null;
        if (contact.getProfilePicture() != null) {
            profilePictureBase64 = "data:" + contact.getProfilePictureType() + ";base64," 
                    + Base64.getEncoder().encodeToString(contact.getProfilePicture());
        }
        
        return ContactDTO.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .dateOfBirth(contact.getDateOfBirth().format(DATE_FORMATTER))
                .profilePicture(profilePictureBase64)
                .build();
    }
} 