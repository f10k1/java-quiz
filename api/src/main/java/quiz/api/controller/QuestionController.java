package quiz.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import quiz.api.entity.Answer;
import quiz.api.entity.Question;
import quiz.api.entity.User;
import quiz.api.repository.AnswerRepository;
import quiz.api.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import quiz.api.validator.QuestionValidator;

import java.util.Optional;
import java.util.Set;

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

    @GetMapping(path="/{id}")
    public @ResponseBody Optional<Question> getQuestion(@PathVariable Integer id) {
        return questionRepository.findById(id);
    }

    @PostMapping(path="/")
    public @ResponseBody ResponseEntity<?> addNewQuestion(@Valid @RequestBody QuestionValidator request){
        try {
            Question newQuestion = new Question();
            newQuestion.setName(request.getName());

            if (!request.getAnswers().isEmpty()) {
                Iterable<Answer> answers = answerRepository.findAllById(request.getAnswers());
                newQuestion.setAnswers((Set<Answer>)answers);
            }

            questionRepository.save(newQuestion);
            return ResponseEntity.ok(HttpStatus.CREATED);
        }
        catch (Exception err){
            return ResponseEntity.internalServerError().body(err.getMessage());
        }

    }
}
