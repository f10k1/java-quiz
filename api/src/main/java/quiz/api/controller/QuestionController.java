package quiz.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.yaml.snakeyaml.util.EnumUtils;
import quiz.api.entity.Answer;
import quiz.api.entity.Question;
import quiz.api.entity.User;
import quiz.api.enums.QUESTION_TYPES;
import quiz.api.repository.AnswerRepository;
import quiz.api.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import quiz.api.validator.FileAttachment;
import quiz.api.validator.QuestionValidator;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping(path = "/question")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @GetMapping(path="/random")
    public @ResponseBody Iterable<Question> getRandomQuestions(@RequestParam(defaultValue = "10") Integer limit) {
        return questionRepository.getRandom(limit);
    }

    @GetMapping(path="/{id}")
    public @ResponseBody Optional<Question> getQuestion(@PathVariable Integer id) {
        return questionRepository.findById(id);
    }

    @PostMapping(path="/")
    public @ResponseBody ResponseEntity<?> addNewQuestion(@Valid @RequestBody QuestionValidator request){
        try {
            Question newQuestion = new Question();
            newQuestion.setName(request.getName());

            try{
                newQuestion.setType(QUESTION_TYPES.valueOf(request.getType()));
            }
            catch(IllegalArgumentException err){
                return ResponseEntity.badRequest().build();
            }

            newQuestion.setActive(request.getActive());


            if(request.getAttachment() != null){
                String encodedImg = request.getAttachment().url.split(",")[1];
                byte[] decodedFile = Base64.getDecoder().decode(encodedImg.getBytes(StandardCharsets.UTF_8));
                Path uploadPath = Paths.get("attachments");

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                try (InputStream inputStream = new ByteArrayInputStream(decodedFile)) {
                    String fileName = request.getAttachment().name;
                    String code = UUID.randomUUID().toString().replace("-", "");
                    Path filePath = uploadPath.resolve( code + fileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    newQuestion.setFile(code + fileName);
                    newQuestion.setFileName(fileName);
                } catch (IOException ioe) {
                    throw new IOException("Could not save file: " + request.getAttachment().name, ioe);
                }
            }

            if (!request.getAnswers().isEmpty()) {
                Iterable<Answer> answers = answerRepository.findAllById(request.getAnswers());
                newQuestion.setAnswers((Set<Answer>)answers);
            }

            Question question = questionRepository.save(newQuestion);

            return ResponseEntity.ok().body(question);
        }
        catch (Exception err){
            return ResponseEntity.internalServerError().body(err.getMessage());
        }

    }

    @PatchMapping("/{id}")
    public @ResponseBody ResponseEntity<?> editQuestion(@PathVariable Integer id, @Valid @RequestBody QuestionValidator request) {
        return ResponseEntity.ok().build();
    }
}
