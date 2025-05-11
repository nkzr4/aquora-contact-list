package com.aquora.contacts.service;

import com.aquora.contacts.dto.ContactCreateDTO;
import com.aquora.contacts.dto.ContactDTO;
import com.aquora.contacts.exception.ResourceNotFoundException;
import com.aquora.contacts.model.Contact;
import com.aquora.contacts.repository.ContactRepository;
import com.aquora.contacts.validator.NameValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
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
        log.info("Criando novo contato: {}", contactDTO.getName());
        
        // Validar dados
        validateContactData(contactDTO);
        validateUniqueFields(contactDTO.getEmail(), contactDTO.getPhone(), null);
        
        // Parse da data
        LocalDate dateOfBirth = parseDate(contactDTO.getDateOfBirth());
        
        Contact contact = Contact.builder()
                .name(contactDTO.getName())
                .email(contactDTO.getEmail())
                .phone(contactDTO.getPhone().replaceAll("\\D", ""))
                .dateOfBirth(dateOfBirth)
                .build();

        if (profilePicture != null && !profilePicture.isEmpty()) {
            log.info("Processando foto de perfil para: {}", contactDTO.getName());
            contact.setProfilePicture(profilePicture.getBytes());
            contact.setProfilePictureType(profilePicture.getContentType());
        }

        Contact savedContact = contactRepository.save(contact);
        log.info("Contato criado com ID: {}", savedContact.getId());
        return convertToDTO(savedContact);
    }

    @Transactional
    public ContactDTO updateContact(Long id, ContactCreateDTO contactDTO, MultipartFile profilePicture) throws IOException {
        log.info("Atualizando contato com ID: {}", id);
        Contact existingContact = findContactById(id);
        
        // Validar dados
        validateContactData(contactDTO);
        validateUniqueFields(contactDTO.getEmail(), contactDTO.getPhone(), id);

        // Parse da data
        LocalDate dateOfBirth = parseDate(contactDTO.getDateOfBirth());

        existingContact.setName(contactDTO.getName());
        existingContact.setEmail(contactDTO.getEmail());
        existingContact.setPhone(contactDTO.getPhone().replaceAll("\\D", ""));
        existingContact.setDateOfBirth(dateOfBirth);

        if (profilePicture != null && !profilePicture.isEmpty()) {
            log.info("Atualizando foto de perfil para contato ID: {}", id);
            existingContact.setProfilePicture(profilePicture.getBytes());
            existingContact.setProfilePictureType(profilePicture.getContentType());
        }

        Contact updatedContact = contactRepository.save(existingContact);
        log.info("Contato atualizado com sucesso, ID: {}", id);
        return convertToDTO(updatedContact);
    }

    @Transactional
    public void deleteContact(Long id) {
        log.info("Excluindo contato com ID: {}", id);
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contato não encontrado com id: " + id);
        }
        contactRepository.deleteById(id);
        log.info("Contato excluído com sucesso, ID: {}", id);
    }

    private Contact findContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com id: " + id));
    }
    
    private LocalDate parseDate(String dateString) {
        try {
            return LocalDate.parse(dateString, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            log.error("Erro ao parsear data: {}", dateString, e);
            throw new IllegalArgumentException("Formato de data inválido. Use o formato YYYY-MM-DD");
        }
    }

    private void validateContactData(ContactCreateDTO contactDTO) {
        // Validar nome
        if (contactDTO.getName() == null || contactDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome é obrigatório");
        }
        if (!NameValidator.isValid(contactDTO.getName())) {
            throw new IllegalArgumentException("Nome inválido. Deve conter pelo menos dois nomes, cada um começando com letra maiúscula. Exceção para preposições 'de', 'do', 'da' e 'e' que devem ser em minúsculo.");
        }
        
        // Validar email
        if (contactDTO.getEmail() == null || contactDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O email é obrigatório");
        }
        
        // Validar telefone
        if (contactDTO.getPhone() == null || contactDTO.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("O telefone é obrigatório");
        }
        
        // Remover caracteres não numéricos
        String phoneNumbers = contactDTO.getPhone().replaceAll("\\D", "");
        if (phoneNumbers.length() < 10 || phoneNumbers.length() > 11) {
            throw new IllegalArgumentException("O telefone deve conter entre 10 e 11 dígitos");
        }
        
        // Validar data de nascimento
        if (contactDTO.getDateOfBirth() == null || contactDTO.getDateOfBirth().trim().isEmpty()) {
            throw new IllegalArgumentException("A data de nascimento é obrigatória");
        }
    }

    private void validateUniqueFields(String email, String phone, Long id) {
        // Limpar o telefone antes de verificar unicidade
        phone = phone.replaceAll("\\D", "");
        
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