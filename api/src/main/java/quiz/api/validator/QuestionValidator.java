package quiz.api.validator;

import jakarta.validation.constraints.*;

import java.util.Optional;
import java.util.Set;

public class QuestionValidator {
    @NotBlank(message = "Pytanie jest wymagane")
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @NotBlank(message = "typ jest wymagany")
    private String type;

    @NotNull(message = "Określ czy pytanie jest aktywne!")
    private Boolean active;

    public FileAttachment getAttachment() {
        return attachment;
    }

    public void setAttachment(FileAttachment attachment) {
        this.attachment = attachment;
    }

    private FileAttachment attachment;
}