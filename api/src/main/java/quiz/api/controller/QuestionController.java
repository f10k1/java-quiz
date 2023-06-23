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

    @PutMapping(path="/")
    public @ResponseBody ResponseEntity<?> addNewQuestion(@Valid @RequestBody QuestionValidator request){
        if (request.getId() == null){
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
                    createFile(request, newQuestion);
                }

                if (request.getAnswers() == null) {
                    Iterable<Answer> answers = answerRepository.findAllById(request.getAnswers());
                }
                Set<Answer> answers = Set.of();

                answerRepository.findAllById(request.getAnswers()).forEach(answers::add);

                newQuestion.setAnswers(answers);

                Question question = questionRepository.save(newQuestion);

                return ResponseEntity.ok().body(question);
            }
            catch (Exception err){
                return ResponseEntity.internalServerError().body(err.getMessage());
            }
        }
        else{
            Optional<Question> question = questionRepository.findById(request.getId());
            if (question.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            try{
                question.get().setActive(request.getActive());
                question.get().setName(request.getName());
                question.get().setType(QUESTION_TYPES.valueOf(request.getType()));

                Iterable<Answer> answerIterable = answerRepository.findAllById(request.getAnswers());
                answerIterable.forEach((answer) -> question.get().addAnswer(answer));


            }
            catch(IllegalArgumentException err){
                return ResponseEntity.badRequest().build();
            }
            try{
                if(request.getAttachment() == null && question.get().getFileName() != null){
                    deleteFile(question.get());
                }
                else if(request.getAttachment() != null && question.get().getFileName() == null) {
                    createFile(request, question.get());
                }

                else if(request.getAttachment() != null && question.get().getFileName() != null){
                    deleteFile(question.get());
                    createFile(request, question.get());
                }
            }
            catch (Exception err){
                return ResponseEntity.internalServerError().body(err.getMessage());
            }

            questionRepository.save(question.get());

            return ResponseEntity.ok().body(question.get());
        }

    }

    private void deleteFile(Question question) throws Exception{
        Path uploadPath = Paths.get("attachments");
        File file = new File(uploadPath.resolve(question.getFileCode()).toAbsolutePath().toString());
        if(file.exists() && file.delete()){
            question.setFile(null);
            question.setFileName(null);
        }
    }

    private void createFile(QuestionValidator request, Question question) throws IOException{
        Path uploadPath = Paths.get("attachments");
        String encodedImg = request.getAttachment().url.split(",")[1];
        byte[] decodedFile = Base64.getDecoder().decode(encodedImg.getBytes(StandardCharsets.UTF_8));

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        try (InputStream inputStream = new ByteArrayInputStream(decodedFile)) {
            String fileName = request.getAttachment().name;
            String code = UUID.randomUUID().toString().replace("-", "");
            Path filePath = uploadPath.resolve(code + fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            inputStream.close();
            question.setFile(code + fileName);
            question.setFileName(fileName);
        } catch (IOException ioe) {
            throw new IOException("Could not save file: " + request.getAttachment().name, ioe);
        }
    }

    @DeleteMapping("/{id}")
    public @ResponseBody ResponseEntity<?> deleteQuestion(@PathVariable Integer id) {
        try{
            Optional<Question> question = questionRepository.findById(id);
            if (question.isEmpty()) return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            if (question.get().getFileCode() != null){
                deleteFile(question.get());
            }

            questionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        catch (Exception err) {
            return ResponseEntity.internalServerError().body(err.getMessage());
        }
    }
}
