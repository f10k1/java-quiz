package quiz.api.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import quiz.api.JwtTokenUtils;
import quiz.api.entity.User;
import quiz.api.repository.UserRepository;
import quiz.api.response.AuthResponse;
import quiz.api.service.UserService;
import quiz.api.validator.AuthRegisterValidator;
import quiz.api.validator.AuthRequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping(path = "/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestValidator request){
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenUtils.generateToken(authentication);
            return ResponseEntity.ok().body(new AuthResponse(request.getUsername(), token));
        } catch (BadCredentialsException | JOSEException exception){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<?> addNewUser(@Valid @RequestBody AuthRegisterValidator request){
        User checkUser = userRepository.checkIfExists(request.getUsername(), request.getEmail());
        if (checkUser != null) return ResponseEntity.ok("{error: \"User exists\"}");
        User newUser = new User();
        newUser.setName(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        userRepository.save(newUser);
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(newUser.getName(), newUser.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenUtils.generateToken(authentication);
           return ResponseEntity.ok().body(new AuthResponse(newUser.getName(), token));
        } catch (BadCredentialsException | JOSEException exception){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
