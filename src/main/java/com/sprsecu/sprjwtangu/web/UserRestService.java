package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import com.sprsecu.sprjwtangu.entities.UserRole;
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
    public UserRole getRole(@PathVariable String username){
        AppUser user =  accountService.findUserByUsername(username);
         Collection<AppRole> roles = accountService.findUserByUsername(username).getRoles();
         if (roles.toString().contains("ADMIN"))
                 return new UserRole(null, null, "ADMIN");
         else if (roles.toString().contains("MANAGER"))
                 return new UserRole(null, null, "ADMIN");
         else if (roles.toString().contains("SHIPPER"))
                return new UserRole(user.getIdUser(), (user.getIdSecond()!=null)? user.getIdSecond() : null, "SHIPPER");
                 //return new AppRole(user.getIdUser(), "SHIPPER");
         else if (roles.toString().contains("TRANSPORTER"))
                 return new UserRole(user.getIdUser(), (user.getIdSecond()!=null)? user.getIdSecond() : null, "TRANSPORTER"); //return new AppRole(user.getIdUser(), "TRANSPORTER");
         else return new UserRole(null, null, "");
    }    
    /*
        public AppRole getRole(@PathVariable String username){
        AppUser user =  accountService.findUserByUsername(username);
         Collection<AppRole> roles = accountService.findUserByUsername(username).getRoles();
         if (roles.toString().contains("ADMIN"))
                 return new AppRole(null, "ADMIN");
         else if (roles.toString().contains("MANAGER"))
                 return new AppRole(null, "MANAGER");
         else if (roles.toString().contains("SHIPPER"))
                 return new AppRole(user.getIdUser(), "SHIPPER");
         else if (roles.toString().contains("TRANSPORTER"))
                 return new AppRole(user.getIdUser(), "TRANSPORTER");
         else return new AppRole(null, "");
    }    
    //*/
}
