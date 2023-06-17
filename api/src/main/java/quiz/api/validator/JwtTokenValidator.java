package quiz.api.validator;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class JwtTokenValidator {

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    @NotNull
    private String jwtToken;
}
