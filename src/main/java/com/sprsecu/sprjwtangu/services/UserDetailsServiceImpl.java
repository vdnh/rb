package com.sprsecu.sprjwtangu.services;

import com.sprsecu.sprjwtangu.entities.AppUser;
import java.util.ArrayList;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author vdnh
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService{
    @Autowired
    private AccountService accountService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user =  accountService.findUserByUsername(username);
        System.out.println("Userdetailserviceimpl has made accountservice findbyusername");
        if(user == null){
            //System.out.println("Not found : " + username);
            System.out.println("I'm in runtime, and i give you this message. your user is wrong!");
            Logger.getLogger(UserDetailsServiceImpl.class.getName()).log(Level.SEVERE, "I'm in runtime, and i give you this message. your user is wrong!");
            throw new UsernameNotFoundException(username);            
        }
        
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(r -> {
            authorities.add(new SimpleGrantedAuthority(r.getRoleName()));
        });
        System.out.println("UserdetailServiceImpl Collection<GrantedAuthority> - authorities : " + authorities.toString());
        
        User userSpring = new User(user.getUsername(), user.getPassword(), authorities);
        System.out.println("UserdetailServiceImpl - userSpring : " + userSpring.toString());
        return userSpring;
    }
    
}
