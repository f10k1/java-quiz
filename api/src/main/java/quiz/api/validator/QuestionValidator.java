package quiz.api.validator;

import jakarta.validation.constraints.*;

public class QuestionValidator {

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    private Integer id;
    @NotBlank(message = "Pytanie jest wymagane")
    private String name;

    private Iterable<Integer> answers;

    public String getName() {
        return name;
    }

    public void setName(String username) {
        this.name = username;
    }

    public Iterable<Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Iterable<Integer> answers) {
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