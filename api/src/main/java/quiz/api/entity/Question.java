package quiz.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import quiz.api.enums.QUESTION_TYPES;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<Answer> answers) {
        this.answers = answers;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Column(columnDefinition = "tinyint(1) default 0")
    private boolean active = false;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private QUESTION_TYPES type = QUESTION_TYPES.ONE_CHOICE;

    @OneToMany(mappedBy = "question", orphanRemoval = true)
    private Set<Answer> answers;

    public QUESTION_TYPES getType() {
        return type;
    }

    public void setType(QUESTION_TYPES type) {
        this.type = type;
    }

    public String getFile() throws IOException {

        if (this.file == null ||this.file.isEmpty()) return null;

        Path uploadPath = Paths.get("attachments");
        InputStream is = new FileInputStream(uploadPath+"/"+this.file);
        BufferedInputStream in = new BufferedInputStream(is);
        String url = new String(in.readAllBytes(), StandardCharsets.US_ASCII);

        return url;
    }

    public void setFile(String file) {
        this.file = file;
    }

    private String file;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    private String fileName;
}