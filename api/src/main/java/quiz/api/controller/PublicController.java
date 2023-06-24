package quiz.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import quiz.api.entity.Answer;
import quiz.api.entity.Question;
import quiz.api.enums.QUESTION_TYPES;
import quiz.api.repository.AnswerRepository;
import quiz.api.repository.QuestionRepository;
import quiz.api.validator.AnswerValidator;

import java.util.Optional;

@RestController
@RequestMapping(path = "/public")
public class PublicController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping(path="/questions")
    public @ResponseBody Iterable<Question> getAllQuestions(@RequestParam Integer limit) {
        return questionRepository.getActive(limit);
    }

//    @PostMapping(path = "/submit")
//    public @ResponseBody ResponseEntity<?> submitAnswers(@Valid )

}
