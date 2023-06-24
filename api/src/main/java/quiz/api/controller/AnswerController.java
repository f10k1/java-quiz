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
import quiz.api.validator.AnswerValidator;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/answer")
public class AnswerController {

    @Autowired
    private AnswerRepository answerRepository;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Answer> getAllQuestions() {
        return answerRepository.findAll();
    }

    @PutMapping("/")
    public @ResponseBody ResponseEntity<?> addNewAnswer(@Valid @RequestBody AnswerValidator request){
        if (request.getId() == null){
            try{
                Answer answer = new Answer();

                answer.setTitle(request.getTitle());

                if (request.isCorrect()){
                    answer.setCorrect(request.isCorrect());
                }

                if (request.getQuestions() != null){

                }
                answerRepository.save(answer);
                return ResponseEntity.ok().body(answer);
            }
            catch (Exception err) {
                return ResponseEntity.internalServerError().body(err.getMessage());
            }
        }
        else{
            Optional<Answer> answer = answerRepository.findById(request.getId());
            if (answer.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            try{
                answer.get().setTitle(request.getTitle());
                answer.get().setCorrect(request.isCorrect());
            }
            catch(IllegalArgumentException err){
                return ResponseEntity.badRequest().build();
            }

            answerRepository.save(answer.get());

            return ResponseEntity.ok().body(answer);
        }

    }

    @DeleteMapping("/")
    public @ResponseBody ResponseEntity<?> deleteAnswer(@PathVariable Integer id) {
        return ResponseEntity.ok().build();
    }
}
