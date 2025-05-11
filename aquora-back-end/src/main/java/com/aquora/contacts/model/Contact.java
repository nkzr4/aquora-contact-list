package com.aquora.contacts.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "contacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String phone;

    @Column(nullable = false, name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Lob
    @Column(name = "profile_picture")
    private byte[] profilePicture;

    @Column(name = "profile_picture_type")
    private String profilePictureType;
} 