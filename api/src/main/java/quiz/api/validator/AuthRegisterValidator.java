package quiz.api.validator;

import jakarta.validation.constraints.*;

public class AuthRegisterValidator {
    @NotEmpty(message = "Username is required") @Size(min = 4, message = "Username must be at least 4 characters long")
    private String username;

    @NotEmpty(message = "Email is required") @Email(message = "Enter valid email")
    private String email;

    @NotEmpty(message = "Password is required") @Size(min = 6) @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$", message = "Password must contain letter, number and special character")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
