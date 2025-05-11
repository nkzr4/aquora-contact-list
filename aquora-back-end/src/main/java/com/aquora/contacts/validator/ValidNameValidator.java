package com.aquora.contacts.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidNameValidator implements ConstraintValidator<ValidName, String> {
    
    @Override
    public void initialize(ValidName constraintAnnotation) {
        // Nada a inicializar
    }
    
    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        return NameValidator.isValid(name);
    }
} 