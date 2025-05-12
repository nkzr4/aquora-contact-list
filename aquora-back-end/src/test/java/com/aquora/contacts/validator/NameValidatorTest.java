package com.aquora.contacts.validator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class NameValidatorTest {

    @ParameterizedTest
    @CsvSource({
        "João Silva, true",
        "Maria da Silva, true",
        "José dos Santos, true",
        "Ana e Silva, true",
        "Pedro do Carmo, true",
        "Carlos Eduardo de Souza, true"
    })
    void isValid_WithValidNames_ShouldReturnTrue(String name, boolean expected) {
        // when
        boolean result = NameValidator.isValid(name);
        
        // then
        assertEquals(expected, result);
    }
    
    @ParameterizedTest
    @ValueSource(strings = {
        "João", // apenas um nome
        "joão Silva", // primeiro nome com inicial minúscula
        "João silva", // segundo nome com inicial minúscula (não é preposição)
        "João De Silva", // preposição com inicial maiúscula
        "João Do Carmo", // preposição com inicial maiúscula
        "João Da Costa", // preposição com inicial maiúscula
        "João E Silva", // preposição com inicial maiúscula
        "J", // nome muito curto
        "" // vazio
    })
    void isValid_WithInvalidNames_ShouldReturnFalse(String name) {
        // when
        boolean result = NameValidator.isValid(name);
        
        // then
        assertFalse(result);
    }
    
    @Test
    void isValid_WithNull_ShouldReturnFalse() {
        // when
        boolean result = NameValidator.isValid(null);
        
        // then
        assertFalse(result);
    }
} 