package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import com.sprsecu.sprjwtangu.entities.UserRole;
import com.sprsecu.sprjwtangu.services.AccountService;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
         else if (roles.toString().contains("DISPATCH"))
                return new UserRole(user.getIdUser(), (user.getIdSecond()!=null)? user.getIdSecond() : null, "DISPATCH");
         else if (roles.toString().contains("TECHNICIEN"))
                return new UserRole(user.getIdUser(), (user.getIdSecond()!=null)? user.getIdSecond() : null, "TECHNICIEN");         
         else return new UserRole(null, null, "");
    }    
    
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public void save(@RequestBody AppUser appUser){
        accountService.saveUser(new AppUser(null, appUser.getUsername(), appUser.getPassword(), null, null, null, appUser.getRoleSimple()));  // id:null automatique, username, password, iduser:null, idsecond:null
        accountService.addRoleToUser(appUser.getUsername(), appUser.getRoleSimple());
    }
    /*
        Stream.of("admin","user","manager").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, u.toUpperCase());
            //userRepository.save(new AppUser(null, u, u, null));
        });
        Stream.of("dispatch1","dispatch2").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null, null, null));  // id:null automatique, username, password, iduser:null, idsecond:null
            accountService.addRoleToUser(u, "DISPATCH");
        });
    */
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
