# Spring Boot Backend

This is the backend application built with Spring Boot, providing REST API endpoints and Keycloak integration.

## Features

- **Spring Boot 3.x** - Latest Spring Boot framework
- **H2 Database** - In-memory database for development
- **Hibernate/JPA** - Object-relational mapping
- **Keycloak Integration** - OAuth2/OIDC authentication
- **Role-based Access Control** - Admin and user roles
- **RESTful APIs** - Tutorial and user management endpoints
- **CORS Configuration** - Cross-origin resource sharing

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Keycloak server running locally on port 8080

## Quick Start

### 1. Ensure Keycloak is Running

Make sure your local Keycloak server is running on port 8080:

\`\`\`bash
# Navigate to your Keycloak installation directory
cd /path/to/keycloak

# Start Keycloak in development mode on port 8080
./bin/kc.sh start-dev --http-port=8080
\`\`\`

### 2. Configure Keycloak

Follow the detailed setup instructions in [../KEYCLOAK_SETUP.md](../KEYCLOAK_SETUP.md)

**Quick checklist:**
- [ ] Realm `demo-realm` created
- [ ] Client `demo-client` configured (public, standard flow)
- [ ] Client roles `USER` and `ADMIN` created
- [ ] Client mapper configured to include roles in ID token
- [ ] Test user `testuser/testuser` created with appropriate roles

### 3. Run the Application

\`\`\`bash
mvn spring-boot:run
\`\`\`

The application will start at http://localhost:8081

## Configuration

The application is configured via `src/main/resources/application.yml`:

\`\`\`yaml
server:
port: 8081

spring:
security:
oauth2:
client:
registration:
keycloak:
client-id: demo-client
scope: openid,profile,email,roles
provider:
keycloak:
issuer-uri: http://localhost:8080/realms/demo-realm

keycloak:
auth-server-url: http://localhost:8080
realm: demo-realm
client-id: demo-client
\`\`\`

## API Endpoints

### Public Endpoints
- `GET /api/public/health` - Health check

### Authenticated Endpoints
- `GET /api/me` - Current user information
- `GET /api/stats` - Application statistics
- `POST /api/auth/logout` - Logout endpoint

### Tutorial Endpoints
- `GET /api/tutorials` - List all tutorials
- `POST /api/tutorials` - Create tutorial (USER role required)
- `PUT /api/tutorials/{id}` - Update tutorial (USER role required)
- `DELETE /api/tutorials/{id}` - Delete tutorial (ADMIN role required)
- `GET /api/tutorials/search?q=term` - Search tutorials

### Admin Endpoints
- `GET /api/admin/users/by-role/{role}` - List users by role (ADMIN role required)
- `GET /api/admin/roles` - Get roles summary (ADMIN role required)

### Development Endpoints
- `GET /h2-console` - H2 database console

## Database Access

- **H2 Console**: http://localhost:8081/h2-console
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: `password`

## Port Configuration

- **Backend Server**: http://localhost:8081
- **Keycloak**: http://localhost:8080 (must be running)
- **Frontend**: http://localhost:3000 (for CORS)

## Security Configuration

The application uses Spring Security with OAuth2/OIDC:

- **OAuth2 Login**: Handles user authentication via Keycloak
- **JWT Resource Server**: Validates JWT tokens for API access
- **Method Security**: Uses `@PreAuthorize` annotations for role-based access
- **CORS**: Configured for frontend at http://localhost:3000

### Role Mapping

Roles from Keycloak are mapped to Spring Security authorities:
- Keycloak `USER` role → Spring Security `ROLE_USER`
- Keycloak `ADMIN` role → Spring Security `ROLE_ADMIN`

## Development

### Running Tests
\`\`\`bash
mvn test
\`\`\`

### Building
\`\`\`bash
mvn clean package
\`\`\`

### Debug Mode
Enable debug logging by adding to `application.yml`:
\`\`\`yaml
logging:
level:
org.springframework.security: DEBUG
com.example.demo: DEBUG
\`\`\`

## Troubleshooting

### Common Issues

1. **Keycloak Connection Failed**
   - Ensure Keycloak is running on port 8080
   - Check if realm `demo-realm` exists
   - Verify client `demo-client` configuration

2. **403 Forbidden on Admin Endpoints**
   - Check if user has ADMIN role in Keycloak
   - Verify client mapper includes roles in ID token
   - Check backend logs for role extraction

3. **Authentication Redirect Fails**
   - Verify redirect URIs in Keycloak client configuration:
      - `http://localhost:8081/login/oauth2/code/keycloak`
   - Check CORS configuration
   - Ensure client is set to "public" type

4. **Port Conflicts**
   - Backend runs on port 8081 (not 8080)
   - Keycloak must be on port 8080
   - Check if ports are available: `lsof -i :8081`

### Debug Information

- Check application logs for security and role extraction debug info
- Visit frontend debug page at http://localhost:3000/debug
- Use H2 console to inspect database state
- Check Keycloak admin console for user and role configuration

### Useful Commands

\`\`\`bash
# Clean and restart
mvn clean spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Skip tests
mvn spring-boot:run -DskipTests

# Enable debug logging
mvn spring-boot:run -Dlogging.level.org.springframework.security=DEBUG

# Check if port 8081 is available
lsof -i :8081
\`\`\`

This backend provides a solid foundation for a Spring Boot application with Keycloak authentication and role-based authorization, running on port 8081.
\`\`\`

Update the frontend README:
