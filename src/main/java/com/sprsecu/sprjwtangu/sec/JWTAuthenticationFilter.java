package com.sprsecu.sprjwtangu.sec;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sprsecu.sprjwtangu.entities.AppUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.io.IOException;
import java.util.Date;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *
 * @author vdnh
 */
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter{

    private AuthenticationManager authenticationManager;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        AppUser user=null;
        try {
            user = new ObjectMapper().readValue(request.getInputStream(), AppUser.class);
        } catch (Exception ex) {
            //System.out.println("I'm in runtime, and i give you this message. your user is wrong!");
            //Logger.getLogger(JWTAuthenticationFilter.class.getName()).log(Level.SEVERE, null, ex);
            throw new RuntimeException(ex);
        }
//        System.out.println("**********");
//        System.out.println("JWTAuthentication.class -- User : " + user.toString());
//        System.out.println("**********");
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(), 
                        user.getPassword()
                ));
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request, HttpServletResponse response, 
            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        
        //System.out.println("Before print Spring user!!!!! ");
        User springUser = (User) authResult.getPrincipal();
        //System.out.println("Spring User now is : "+springUser.toString() + " password: "+springUser.getPassword());
        String jwtToken=Jwts.builder().setSubject(springUser.getUsername())
                .setExpiration(new Date(System.currentTimeMillis()+SecurityConstants.EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SecurityConstants.SECRET)
                .claim("roles", springUser.getAuthorities())
                .compact();
        //System.out.println("JWT Tonken is : "+jwtToken);
        response.addHeader(SecurityConstants.HEADER_STRING,
                SecurityConstants.TOKEN_PREFIX+jwtToken);
    }
    
}
