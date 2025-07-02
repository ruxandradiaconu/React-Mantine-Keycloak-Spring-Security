package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "CLASSROOMS")
public class ClassroomEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "floor")
	private Integer floor;

	@Column(name = "capacity")
	private Integer capacity;

	@Column(name = "type")
	private String type ;

	@Column(name = "has_video_projector")
	private Boolean has_video_projector;
}
