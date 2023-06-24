package quiz.api.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import quiz.api.entity.Question;

public interface QuestionRepository extends CrudRepository<Question, Integer>{
    @Query(value = "select distinct * from Question question order by RAND() limit :limitCount", nativeQuery = true)
    Iterable<Question> getRandom(@Param("limitCount") Integer limitCount);

    @Query(value = "select distinct * from Question question where question.active = 1 order by RAND() limit :limitCount", nativeQuery = true)
    Iterable<Question> getActive(@Param("limitCount") Integer limitCount);
}
