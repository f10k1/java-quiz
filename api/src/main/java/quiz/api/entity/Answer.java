package quiz.api.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }


    @JsonIgnoreProperties("answers")
    public Set<Question> getQuestions() {
        return question;
    }

    public void setQuestion(Set<Question> question) {
        this.question = question;
    }

    @NotNull
    private String title;

    @Column(columnDefinition = "tinyint(1) default 0")
    private Boolean correct;

    @ManyToMany(mappedBy = "answers")
    private Set<Question> question = new HashSet<Question>();
}
