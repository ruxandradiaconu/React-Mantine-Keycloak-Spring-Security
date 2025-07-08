-- Create table tutorials
CREATE TABLE TUTORIALS (
                           id BIGSERIAL PRIMARY KEY,
                           tutorial_value VARCHAR(255) NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into tutorials
INSERT INTO TUTORIALS (tutorial_value) VALUES
                                           ('Introduction to Spring Boot'),
                                           ('Getting Started with React'),
                                           ('Keycloak Authentication Setup'),
                                           ('Building REST APIs with Spring'),
                                           ('Frontend State Management');

-- Create table classrooms
CREATE TABLE CLASSROOMS (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(20) NOT NULL,
    -- building VARCHAR(100) NOT NULL,
                            floor INT,
                            capacity INT,
                            type VARCHAR(50),
                            has_video_projector BOOLEAN DEFAULT FALSE
    -- Uncomment this CHECK if you want type validation:
    -- , CHECK (type IN ('AMPHITEATHRE', 'LABORATORY', 'SEMINAR', 'ADMINISTRATIVE', 'OTHER'))
);

-- Insert sample data into classrooms
INSERT INTO CLASSROOMS (name, floor, capacity, type, has_video_projector) VALUES
                                                                                  ('Laborator Practica', 1, 25, 'LABORATORY', true),
                                                                                  ('ec000', 0, 130, 'amfiteatru', false),
                                                                                  ('acasa', -1, 1, 'home office', false);


CREATE TABLE COURSES
(
    id                 BIGSERIAL primary key,
    course_name         VARCHAR(100) not null,
    professor_username VARCHAR(100)
)