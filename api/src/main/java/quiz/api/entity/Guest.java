package quiz.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private String name;

    @OneToMany(mappedBy = "guest")
    private List<Score> score;
}