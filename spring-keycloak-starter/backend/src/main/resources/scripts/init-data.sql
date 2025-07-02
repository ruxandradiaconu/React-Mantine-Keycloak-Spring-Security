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


create table classrooms(
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    -- building VARCHAR(100) NOT NULL,
    floor INT,
    capacity INT,
    type VARCHAR(50), --CHECK ( type in ('AMPHITEATHRE', 'LABORATORY', 'SEMINAR', 'ADMINISTRATIVE','OTHER') ),
    has_video_projector BOOLEAN default FALSE
);

insert into classrooms(id, name, floor, capacity, type, has_video_projector) values
(1, 'Laborator Practica', 1, 25, 'LABORATORY', true),
(2, 'ec000', 0, 130, 'amfiteatru', false),
(5, 'acasa', -1, 1, 'home office', false)
;