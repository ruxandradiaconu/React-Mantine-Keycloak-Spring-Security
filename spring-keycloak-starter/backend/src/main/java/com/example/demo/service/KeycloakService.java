package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;

@Service
public class KeycloakService {

    @Value("${spring.security.oauth2.client.provider.keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${spring.security.oauth2.client.provider.keycloak.realm:demo-realm}")
    private String realm;

    @Value("${spring.security.oauth2.client.provider.keycloak.client-id:demo-client}")
    private String clientId;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> getUsersByRole(String roleName) {
        try {
            // Get admin access token
            String adminToken = getAdminToken();

            // Get client UUID
            String clientUuid = getClientUuid(adminToken);

            // Get role UUID
            String roleUuid = getClientRoleUuid(adminToken, clientUuid, roleName);

            // Get users with this role
            return getUsersWithClientRole(adminToken, clientUuid, roleName);

        } catch (Exception e) {
            System.err.println("Error fetching users by role: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public Map<String, Object> getRolesSummary() {
        try {
            String adminToken = getAdminToken();
            String clientUuid = getClientUuid(adminToken);

            List<Map<String, Object>> roles = getClientRoles(adminToken, clientUuid);
            Map<String, Object> summary = new HashMap<>();

            for (Map<String, Object> role : roles) {
                String roleName = (String) role.get("name");
                List<Map<String, Object>> usersWithRole = getUsersWithClientRole(adminToken, clientUuid, roleName);
                summary.put(roleName, Map.of(
                        "count", usersWithRole.size(),
                        "users", usersWithRole.stream()
                                .map(user -> Map.of(
                                        "username", user.get("username"),
                                        "email", user.get("email"),
                                        "firstName", user.get("firstName"),
                                        "lastName", user.get("lastName")
                                ))
                                .toList()
                ));
            }

            return summary;
        } catch (Exception e) {
            System.err.println("Error fetching roles summary: " + e.getMessage());
            return new HashMap<>();
        }
    }

    private String getAdminToken() {
        String url = keycloakUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=password&client_id=admin-cli&username=admin&password=admin";

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> tokenResponse = response.getBody();
            return (String) tokenResponse.get("access_token");
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get admin token: " + e.getMessage());
        }
    }

    private String getClientUuid(String adminToken) {
        String url = keycloakUrl + "/admin/realms/" + realm + "/clients?clientId=" + clientId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
            List<Map<String, Object>> clients = response.getBody();

            if (clients != null && !clients.isEmpty()) {
                return (String) clients.get(0).get("id");
            }
            throw new RuntimeException("Client not found: " + clientId);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get client UUID: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> getClientRoles(String adminToken, String clientUuid) {
        String url = keycloakUrl + "/admin/realms/" + realm + "/clients/" + clientUuid + "/roles";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get client roles: " + e.getMessage());
        }
    }

    private String getClientRoleUuid(String adminToken, String clientUuid, String roleName) {
        String url = keycloakUrl + "/admin/realms/" + realm + "/clients/" + clientUuid + "/roles/" + roleName;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            Map<String, Object> role = response.getBody();
            return (String) role.get("id");
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get role UUID: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> getUsersWithClientRole(String adminToken, String clientUuid, String roleName) {
        String url = keycloakUrl + "/admin/realms/" + realm + "/clients/" + clientUuid + "/roles/" + roleName + "/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.err.println("Failed to get users with role " + roleName + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
