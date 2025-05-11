package com.aquora.contacts.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidNameValidator.class)
public @interface ValidName {
    String message() default "Nome inválido. Deve conter pelo menos dois nomes, cada um começando com letra maiúscula. Exceção para preposições 'de', 'do', 'da' e 'e' que devem ser em minúsculo.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
} 