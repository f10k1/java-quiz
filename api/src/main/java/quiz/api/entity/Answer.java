package quiz.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Date;

@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private Integer title;

    @NotNull
    private Boolean correct;

    @ManyToOne()
    @JoinColumn(name = "question_id")
    private Question question;
}
