package quiz.api.repository;

import quiz.api.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends CrudRepository<User, Integer>{

    @Query("select distinct user from User user where user.name = :username")
    User findByUsername(@Param("username") String username);

    @Query("select distinct user from User user where user.name = :username or user.email = :email")
    User checkIfExists(@Param("username") String username, @Param("email") String email);
}
