package quiz.api;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.PlainJWT;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.text.ParseException;
import java.util.Date;

@Component
public class JwtTokenUtils {

    @Value("${JWT_SECRET}")
    private String SECRET_KEY;
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    public String generateToken(Authentication authentication) throws JOSEException {
        Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION_TIME);
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .expirationTime(expirationDate)
                .build();

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        JWSSigner signer = new MACSigner(this.SECRET_KEY.getBytes());
        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public boolean validateToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(this.SECRET_KEY.getBytes());
        System.out.println(token);
        return signedJWT.verify(verifier) && !signedJWT.getJWTClaimsSet().getExpirationTime().before(new Date());
    }

    public String getUsername(String token) throws Exception {
        return JWTParser.parse(token).getJWTClaimsSet().getSubject();
    }

}
