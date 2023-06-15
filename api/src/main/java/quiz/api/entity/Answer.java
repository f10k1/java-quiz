package quiz.api.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Date;

@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Integer title;

    private Boolean correct;

    @ManyToOne()
    @JoinColumn(name = "question_id")
    private Question question;
}
