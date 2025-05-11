package com.aquora.contacts.validator;

import java.util.Arrays;
import java.util.List;

public class NameValidator {
    
    private static final List<String> ALLOWED_LOWERCASE_PREPOSITIONS = Arrays.asList("de", "do", "da", "e");
    
    public static boolean isValid(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        String[] parts = name.trim().split("\\s+");
        
        // Verifica se tem pelo menos dois nomes
        if (parts.length < 2) {
            return false;
        }
        
        for (String part : parts) {
            // Verifica se cada parte tem pelo menos um caractere
            if (part.length() < 1) {
                return false;
            }
            
            // Verifica se é uma preposição permitida (deve ser toda minúscula)
            if (ALLOWED_LOWERCASE_PREPOSITIONS.contains(part.toLowerCase())) {
                if (!part.equals(part.toLowerCase())) {
                    return false;
                }
                continue;
            }
            
            // Verifica se começa com letra maiúscula
            if (!Character.isUpperCase(part.charAt(0))) {
                return false;
            }
        }
        
        return true;
    }
} 