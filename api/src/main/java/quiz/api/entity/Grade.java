package quiz.api.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;

    private String grade;

    @OneToMany(mappedBy = "grade", orphanRemoval = true)
    private Set<Score> scores;
}
