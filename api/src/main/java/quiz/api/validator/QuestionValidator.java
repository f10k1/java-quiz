package quiz.api.validator;

import jakarta.validation.constraints.*;

import java.util.Arrays;
import java.util.Set;

public class QuestionValidator {
    @NotEmpty(message = "Pytanie jest wymagane")
    private String name;

    private Set<Integer> answers = Set.of();

    public String getName() {
        return name;
    }

    public void setName(String username) {
        this.name = username;
    }

    public Set<Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<Integer> answers) {
        this.answers = answers;
    }
}
