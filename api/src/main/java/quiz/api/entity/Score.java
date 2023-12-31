package quiz.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Date;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private Integer points;

    @CreatedDate
    private Date created;

    @NotNull
    @ManyToOne()
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @ManyToOne()
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;
}
