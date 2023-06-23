package quiz.api.validator;

import jakarta.validation.constraints.*;

import java.util.List;


public class AnswerValidator {

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    private Integer id;

    @NotBlank(message = "Odpowiedź jest wymagane")
    private String title;


    public String getTitle() {
        return title;
    }

    public void setTitle(String username) {
        this.title = username;
    }


    private boolean correct = false;

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public List<Integer> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Integer> questions) {
        this.questions = questions;
    }

    private List<Integer> questions;


}