package quiz.api.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "question", orphanRemoval = true)
    private Set<Answer> answers;
}
