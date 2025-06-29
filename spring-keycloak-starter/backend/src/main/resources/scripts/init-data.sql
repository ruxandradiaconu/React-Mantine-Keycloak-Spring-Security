-- Create table
CREATE TABLE tutorials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tutorial_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Insert sample data
INSERT INTO tutorials (tutorial_value, created_at, updated_at) VALUES
('Introduction to Spring Boot', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Getting Started with React', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Keycloak Authentication Setup', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Building REST APIs with Spring', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Frontend State Management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
