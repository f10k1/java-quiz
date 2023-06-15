package quiz.api.repository;

import quiz.api.entity.Guest;
import org.springframework.data.repository.CrudRepository;

public interface GuestRepository extends CrudRepository<Guest, Integer>{
}
