package com.example.demo.controller;

import com.example.demo.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApiController {

    @Autowired
    private TutorialService tutorialService;

    @GetMapping("/public/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Spring Boot API is running"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            Authentication authentication,
            @AuthenticationPrincipal Jwt jwt,
            @AuthenticationPrincipal OidcUser oidcUser) {

        System.out.println("=== /api/me Debug Info ===");
        System.out.println("Authentication: " + authentication);
        System.out.println("Authentication authorities: " +
                (authentication != null ? authentication.getAuthorities() : "null"));
        System.out.println("JWT: " + (jwt != null ? "present" : "null"));
        System.out.println("OidcUser: " + (oidcUser != null ? "present" : "null"));

        Map<String, Object> userInfo = new HashMap<>();

        if (jwt != null) {
            userInfo.put("username", jwt.getClaimAsString("preferred_username"));
            userInfo.put("email", jwt.getClaimAsString("email"));
            userInfo.put("firstName", jwt.getClaimAsString("given_name"));
            userInfo.put("lastName", jwt.getClaimAsString("family_name"));
            userInfo.put("roles", extractRolesFromJwt(jwt));
            userInfo.put("authType", "JWT");

            // Add authorities from Spring Security context
            if (authentication != null) {
                List<String> authorities = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());
                userInfo.put("springAuthorities", authorities);
            }
        } else if (oidcUser != null) {
            userInfo.put("username", oidcUser.getPreferredUsername());
            userInfo.put("email", oidcUser.getEmail());
            userInfo.put("firstName", oidcUser.getGivenName());
            userInfo.put("lastName", oidcUser.getFamilyName());
            userInfo.put("roles", extractRolesFromOidcUser(oidcUser));
            userInfo.put("authType", "OAuth2");

            // Add authorities from Spring Security context
            List<String> authorities = oidcUser.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            userInfo.put("springAuthorities", authorities);
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "No authentication found"));
        }

        System.out.println("Returning user info: " + userInfo);
        return ResponseEntity.ok(userInfo);
    }

    private List<String> extractRolesFromJwt(Jwt jwt) {
        List<String> roles = new ArrayList<>();

        // Try simple "roles" claim first
        List<String> directRoles = jwt.getClaimAsStringList("roles");
        if (directRoles != null && !directRoles.isEmpty()) {
            return directRoles;
        }

        // Extract from resource_access.demo-client
        Object resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess instanceof Map) {
            Object clientAccess = ((Map<?, ?>) resourceAccess).get("demo-client");
            if (clientAccess instanceof Map) {
                Object rolesObj = ((Map<?, ?>) clientAccess).get("roles");
                if (rolesObj instanceof List) {
                    roles.addAll(((List<?>) rolesObj).stream()
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .collect(Collectors.toList()));
                }
            }
        }

        return roles;
    }

    private List<String> extractRolesFromOidcUser(OidcUser oidcUser) {
        List<String> roles = new ArrayList<>();

        // Try simple "roles" claim first
        List<String> directRoles = oidcUser.getClaimAsStringList("roles");
        if (directRoles != null && !directRoles.isEmpty()) {
            return directRoles;
        }

        // Extract from Spring Security authorities
        roles.addAll(oidcUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5))
                .collect(Collectors.toList()));

        return roles;
    }

    @GetMapping("/admin/users/by-role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUsersByRole(
            @PathVariable String role,
            Authentication authentication) {

        System.out.println("=== /api/admin/users/by-role Debug ===");
        System.out.println("User authorities: " + authentication.getAuthorities());
        System.out.println("Requested role: " + role);

        List<Map<String, Object>> usersWithRole = tutorialService.getUsersByRole(role);

        return ResponseEntity.ok(Map.of(
                "role", role,
                "count", usersWithRole.size(),
                "users", usersWithRole,
                "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/admin/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllRoles(Authentication authentication) {
        System.out.println("=== /api/admin/roles Debug ===");
        System.out.println("User authorities: " + authentication.getAuthorities());

        return ResponseEntity.ok(tutorialService.getRolesSummary());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        boolean isAdmin = authorities.contains("ROLE_ADMIN");

        return ResponseEntity.ok(Map.of(
                "totalTutorials", tutorialService.getAllTutorials().size(),
                "timestamp", System.currentTimeMillis(),
                "isAdmin", isAdmin,
                "userAuthorities", authorities
        ));
    }
}
