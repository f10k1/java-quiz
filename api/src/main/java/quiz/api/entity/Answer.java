package quiz.api.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@JsonIdentityInfo(generator= ObjectIdGenerators.IntSequenceGenerator.class, property="answer_id")
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
