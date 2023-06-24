package quiz.api.validator;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SubmitValidator {

    @NotNull(message = "Musisz podać pytanie")
    private Integer questionId;

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public ValidList<Integer> getAnswersId() {
        return answersId;
    }

    public void setAnswersId(ValidList<Integer> answersId) {
        this.answersId = answersId;
    }

    @NotNull(message = "Musisz podać odpowiedzi")
    private ValidList<Integer> answersId;


}
