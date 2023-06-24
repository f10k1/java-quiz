package quiz.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.nimbusds.jose.shaded.gson.JsonObject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import quiz.api.entity.Answer;
import quiz.api.entity.Question;
import quiz.api.repository.AnswerRepository;
import quiz.api.repository.QuestionRepository;
import quiz.api.validator.SubmitValidator;
import quiz.api.validator.ValidList;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;



@RestController
@RequestMapping(path = "/public")
public class PublicController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @GetMapping(path="/questions")
    public @ResponseBody Iterable<Question> getAllQuestions(@RequestParam Integer limit) {
        return questionRepository.getActive(limit);
    }

    @PostMapping(path = "/submit")
    public @ResponseBody ResponseEntity<?> submitAnswers(@RequestBody @Valid ValidList<SubmitValidator> requestAnswers){

        Double points = 0.0;
        HashSet<Integer> answerIds = new HashSet<>();
        ArrayList<Integer> questionIds = new ArrayList<>();
        requestAnswers.forEach(answer ->{
            answer.getAnswersId().forEach(id -> answerIds.add(id));
        });

        requestAnswers.forEach(answer -> questionIds.add(answer.getQuestionId()));

        HashMap<Integer, Answer> answers = new HashMap();
        answerRepository.findAllById(answerIds).forEach(answer -> answers.put(answer.getId(), answer));
        HashMap<Integer, Question> questions = new HashMap<>();
        questionRepository.findAllById(questionIds).forEach(question -> questions.put(question.getId(), question));

        for(SubmitValidator answer: requestAnswers){
            if (answer.getAnswersId().size() > 1){
                Integer counter = 0;
                for(Answer tmpAnswer: questions.get(answer.getQuestionId()).getAnswers()){
                    if(tmpAnswer.getCorrect() != null && tmpAnswer.getCorrect())counter++;
                }
                Integer tmp = 0;
                for(Integer id: answer.getAnswersId()){
                    if(answers.get(id).getCorrect() != null && answers.get(id).getCorrect()) tmp++;
                    else tmp--;
                }
                if (tmp > 0){
                    points += (double)tmp/counter;
                }
            }
            else if (answer.getAnswersId().size() > 0 && !answer.getAnswersId().get(0).equals(-1) && answers.get(answer.getAnswersId().get(0)).getCorrect() != null && answers.get(answer.getAnswersId().get(0)).getCorrect()) points++;
        };

        if (points/requestAnswers.size() > 1){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        ObjectMapper mapper = new ObjectMapper();

        ObjectNode node = mapper.createObjectNode();
        node.put("percentage", points/requestAnswers.size());

        return ResponseEntity.ok().body(node);
    }

}
