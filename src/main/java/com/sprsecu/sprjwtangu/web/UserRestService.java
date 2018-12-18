package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import com.sprsecu.sprjwtangu.services.AccountService;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author 
 */
@RestController
@CrossOrigin("*")
public class UserRestService {
    @Autowired
    private AccountService accountService;
        
    @RequestMapping(value = "/users/{username}", method = RequestMethod.GET)
    public Collection<AppRole> getRole(@PathVariable String username){
        return accountService.findUserByUsername(username).getRoles();
    }    
}
