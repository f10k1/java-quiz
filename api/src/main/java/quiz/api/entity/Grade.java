package quiz.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    private String grade;

    @OneToMany(mappedBy = "grade", orphanRemoval = true)
    private List<Score> scores;
}
