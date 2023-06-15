package quiz.api.repository;

import org.springframework.data.repository.CrudRepository;
import quiz.api.entity.Question;

public interface QuestionRepository extends CrudRepository<Question, Integer>{
}
