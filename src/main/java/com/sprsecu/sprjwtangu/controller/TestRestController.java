package com.sprsecu.sprjwtangu.controller;

//import com.sprsecu.sprjwtangu.dao.TaskRepository;
//import com.sprsecu.sprjwtangu.entities.Task;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import java.util.Collection;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 */
@RestController
public class TestRestController {
//    @Autowired
//    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    //@RequestMapping(value = "//userInfo/{userName}", method = RequestMethod.GET, produces="text/plain")
    @GetMapping("/userInfo/{userName}")
    public String user(@PathVariable String userName){
        AppUser appUser;// = new AppUser();        
        appUser =  userRepository.findByUsername(userName);
        Collection<AppRole> appRoles = appUser.getRoles();
        String role = appRoles.toString();
        if (role.contains("ADMIN"))
            return role = "ADMIN";
        if (role.contains("MANAGER"))
            return role = "MANAGER";
        if (role.contains("USER"))
            return role = "USER";
        if (role.contains("SHIPPER"))
            return role = "SHIPPER";
        if (role.contains("TRANSPORTER"))
            return role = "TRANSPORTER";
        //String userRoles = appRoles.toString();
        return role;
    }
    
//    
//    @GetMapping("/tasks")
//    public List<Task> listAll(){
//        return taskRepository.findAll();
//    }
//    
//    @PostMapping("/tasks")
//    public Task save(@RequestBody Task task){
//        return taskRepository.save(task);
//    }
//    
    //@PatchMapping Task update(@RequestBody )
}
