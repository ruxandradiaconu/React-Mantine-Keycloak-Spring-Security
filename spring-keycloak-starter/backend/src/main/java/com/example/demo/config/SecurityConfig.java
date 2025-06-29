package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.*;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/", "/static/**", "/api/public/**", "/api/auth/**", "/h2-console/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.oidcUserService(oidcUserService()))
                        .defaultSuccessUrl("http://localhost:3000/dashboard", true)
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("http://localhost:3000")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                )
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**", "/api/**", "/logout"))
                .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }

    @Bean
    public OAuth2UserService<OidcUserRequest, OidcUser> oidcUserService() {
        final OidcUserService delegate = new OidcUserService();

        return (userRequest) -> {
            OidcUser oidcUser = delegate.loadUser(userRequest);
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

            // Add existing authorities
            mappedAuthorities.addAll(oidcUser.getAuthorities());

            // Extract roles and map them to Spring Security authorities
            List<String> roles = extractRoles(oidcUser);
            for (String role : roles) {
                mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                System.out.println("Mapped role to authority: ROLE_" + role);
            }

            System.out.println("Final authorities for user " + oidcUser.getPreferredUsername() + ": " +
                    mappedAuthorities.stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()));

            return new DefaultOidcUser(mappedAuthorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
        };
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthoritiesFromJwt);
        return converter;
    }

    private Collection<GrantedAuthority> extractAuthoritiesFromJwt(Jwt jwt) {
        List<String> roles = extractRolesFromJwt(jwt);
        List<GrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

        System.out.println("JWT authorities for user " + jwt.getClaimAsString("preferred_username") + ": " +
                authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()));

        return authorities;
    }

    private List<String> extractRoles(OidcUser oidcUser) {
        List<String> roles = new ArrayList<>();

        // Try simple "roles" claim first (this is what we'll configure in Keycloak)
        List<String> directRoles = oidcUser.getClaimAsStringList("roles");
        if (directRoles != null && !directRoles.isEmpty()) {
            roles.addAll(directRoles);
            System.out.println("Found direct roles claim: " + directRoles);
            return roles;
        }

        // Extract from resource_access.demo-client
        Object resourceAccess = oidcUser.getClaim("resource_access");
        if (resourceAccess instanceof Map) {
            Object clientAccess = ((Map<?, ?>) resourceAccess).get("demo-client");
            if (clientAccess instanceof Map) {
                Object rolesObj = ((Map<?, ?>) clientAccess).get("roles");
                if (rolesObj instanceof List) {
                    List<String> clientRoles = ((List<?>) rolesObj).stream()
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .collect(Collectors.toList());
                    roles.addAll(clientRoles);
                    System.out.println("Found client roles: " + clientRoles);
                }
            }
        }

        // Extract from realm_access (filter out default ones)
        Object realmAccess = oidcUser.getClaim("realm_access");
        if (realmAccess instanceof Map) {
            Object rolesObj = ((Map<?, ?>) realmAccess).get("roles");
            if (rolesObj instanceof List) {
                List<String> realmRoles = ((List<?>) rolesObj).stream()
                        .filter(String.class::isInstance)
                        .map(String.class::cast)
                        .filter(role -> !role.startsWith("default-") &&
                                !role.equals("offline_access") &&
                                !role.equals("uma_authorization"))
                        .collect(Collectors.toList());
                roles.addAll(realmRoles);
                System.out.println("Found realm roles: " + realmRoles);
            }
        }

        return roles.stream().distinct().collect(Collectors.toList());
    }

    private List<String> extractRolesFromJwt(Jwt jwt) {
        List<String> roles = new ArrayList<>();

        // Try simple "roles" claim first
        List<String> directRoles = jwt.getClaimAsStringList("roles");
        if (directRoles != null && !directRoles.isEmpty()) {
            roles.addAll(directRoles);
            System.out.println("Found direct JWT roles claim: " + directRoles);
            return roles;
        }

        // Extract from resource_access.demo-client
        Object resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess instanceof Map) {
            Object clientAccess = ((Map<?, ?>) resourceAccess).get("demo-client");
            if (clientAccess instanceof Map) {
                Object rolesObj = ((Map<?, ?>) clientAccess).get("roles");
                if (rolesObj instanceof List) {
                    List<String> clientRoles = ((List<?>) rolesObj).stream()
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .collect(Collectors.toList());
                    roles.addAll(clientRoles);
                    System.out.println("Found JWT client roles: " + clientRoles);
                }
            }
        }

        return roles.stream().distinct().collect(Collectors.toList());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
