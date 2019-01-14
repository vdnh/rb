package com.sprsecu.sprjwtangu.sec;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *
 * @author vdnh
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        //throws Exception {
        /*
        auth.inMemoryAuthentication()
        .withUser("admin").password("password").roles("ADMIN","USER");//*/
        //System.out.println("Before auth.userDetailsService!!!!!");
        //Logger.getLogger("Before auth.userDetailsService!!!!! - By Logger");
        try {        
            auth.userDetailsService(userDetailsService)
                    .passwordEncoder(bCryptPasswordEncoder);
        } catch (Exception ex) {
            //System.out.println("Password is wrong!!!!!");
            //Logger.getLogger(WebSecurityConfig.class.getName()).log(Level.SEVERE, null, ex);
        }
        //Logger.getLogger("After auth.userDetailsService!!!!! - By Logger");
        //System.out.println("Password is good!!!!!");
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        //http.formLogin();//.loginPage("/login");
        
        //for jwt you don't create session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        //
        
        http.authorizeRequests().antMatchers("/login/**", "/shippers/**", "/transporters/**", "/contacts/**", 
                "/adresses/**", "/camions/**" ).permitAll(); //"/h2-console/**",  
        //http.authorizeRequests().antMatchers(HttpMethod.POST, "/tasks/**").hasAuthority("ADMIN");
        http.authorizeRequests().anyRequest().authenticated(); 
        
        // and then create the filters follow
        http.addFilter(new JWTAuthenticationFilter(authenticationManager()));
        http.addFilterBefore(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
        //
        /*
        .and()
            .logout().logoutUrl("/logout").logoutSuccessUrl("/login")
                .deleteCookies("JSESSIONID").invalidateHttpSession(true);//*/
    }

    
    
}
