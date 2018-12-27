package com.sprsecu.sprjwtangu.sec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 *
 * @author vdnh
 */
public class JWTAuthorizationFilter extends OncePerRequestFilter{

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
            HttpServletResponse respone, FilterChain filterChain) 
            throws ServletException, IOException {
        respone.addHeader("Access-Control-Allow-Origin", "*");
        respone.addHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With,"
                + " Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,"
                + " Authorization");
        respone.addHeader("Access-Control-Expose-Headers", "Access-Control-Allow-Origin, "
                + "Access-Control-Allow-Credentials, Authorization");
        String jwt = request.getHeader(SecurityConstants.HEADER_STRING);
        if(request.getMethod().equals("OPTIONS")){
            respone.setStatus(HttpServletResponse.SC_OK);
        }
        else{
            if(jwt==null || !jwt.startsWith(SecurityConstants.TOKEN_PREFIX)){
            filterChain.doFilter(request, respone); return;
            }
            Claims claims=Jwts.parser()
                    .setSigningKey(SecurityConstants.SECRET)
                    .parseClaimsJws(jwt.replace(SecurityConstants.TOKEN_PREFIX, ""))
                    .getBody();
            //System.out.println("JWTAuthorizationFilter.class - claims info : "+claims.toString());
            String username = claims.getSubject();
            ArrayList<Map<String, String>> roles= (ArrayList<Map<String, String>>) claims.get("roles");
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            roles.forEach(r ->{
                authorities.add(new SimpleGrantedAuthority(r.get("authority")));
            });
            UsernamePasswordAuthenticationToken authenticatedUser = 
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
            filterChain.doFilter(request, respone);
        }
        
    }
    
}
