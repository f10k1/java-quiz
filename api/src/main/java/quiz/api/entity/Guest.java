package quiz.api.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "guest")
    private Set<Score> score;
}