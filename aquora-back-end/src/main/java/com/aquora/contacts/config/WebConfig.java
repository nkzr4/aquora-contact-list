package com.aquora.contacts.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite requisições de qualquer origem
        config.addAllowedOriginPattern("*");
        
        // Permite todos os métodos HTTP
        config.addAllowedMethod("*");
        
        // Permite todos os cabeçalhos
        config.addAllowedHeader("*");
        
        // Não precisamos de credenciais (cookies, etc.)
        config.setAllowCredentials(false);
        
        // Registra essa configuração para todos os endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
} 