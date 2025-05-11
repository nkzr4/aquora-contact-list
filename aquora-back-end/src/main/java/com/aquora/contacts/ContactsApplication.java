package com.aquora.contacts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "API de Agenda de Contatos",
        version = "1.0",
        description = "API para gerenciamento de contatos para Aquora"
    )
)
public class ContactsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContactsApplication.class, args);
    }
} 