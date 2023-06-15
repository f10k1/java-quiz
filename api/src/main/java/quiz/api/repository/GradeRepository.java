package quiz.api.repository;

import quiz.api.entity.Grade;
import org.springframework.data.repository.CrudRepository;

public interface GradeRepository extends CrudRepository<Grade, Integer>{
}
