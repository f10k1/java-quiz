package quiz.api.repository;

import quiz.api.entity.Answer;
import org.springframework.data.repository.CrudRepository;

public interface AnswerRepository extends CrudRepository<Answer, Integer>{
}
