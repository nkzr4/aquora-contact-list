package com.aquora.contacts.dto;

import com.aquora.contacts.validator.ValidName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactCreateDTO {
    
    @NotBlank(message = "O nome é obrigatório")
    @ValidName
    private String name;
    
    @NotBlank(message = "O email é obrigatório")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email inválido")
    private String email;
    
    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "^\\d{10,11}$", message = "O telefone deve conter entre 10 e 11 dígitos")
    private String phone;
    
    @NotBlank(message = "A data de nascimento é obrigatória")
    private String dateOfBirth;
} 