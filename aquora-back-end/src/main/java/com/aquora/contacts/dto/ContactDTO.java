package com.aquora.contacts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String profilePicture; // Base64 encoded
} 