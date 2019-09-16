package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.UserLogsRepository;
import com.sprsecu.sprjwtangu.entities.UserLogs;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 */
@RestController
@CrossOrigin("*")
public class UserLogsRestService {
    @Autowired  UserLogsRepository userLogsRepository;
    
    
    @RequestMapping(value = "/userLogs", method = RequestMethod.GET)
    public List<UserLogs> getuserLogs(){
        return userLogsRepository.findAll();
    }
    
    @RequestMapping(value = "/userLogs/{id}", method = RequestMethod.GET)
    public UserLogs getUserLogs(@PathVariable Long id){
        return userLogsRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/userLogs", method = RequestMethod.POST)
    public UserLogs save(@RequestBody UserLogs userLogs){
        return userLogsRepository.save(userLogs);
    }
    
    @RequestMapping(value = "/userLogs/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        userLogsRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/userLogs", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        userLogsRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/userLogs/{id}", method = RequestMethod.PUT)
    public UserLogs updateUserLogs(@PathVariable Long id, @RequestBody UserLogs userLogs){
        userLogs.setId(id);
        return userLogsRepository.save(userLogs);
    }    
    
    @RequestMapping(value = "/userLogsDeUsernameLogin", method = RequestMethod.GET)
    public Page<UserLogs> userLogsDeUsernameLogin(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "20")int size){
        return userLogsRepository.userLogsDeUsernameLogin("%"+mc+"%", PageRequest.of(page, size));
    }    
    
    @RequestMapping(value = "/userLogsDeEntrepriseId", method = RequestMethod.GET)
    public List<UserLogs> userLogsDeEntrepriseId(@RequestParam(name = "entrepriseId", defaultValue = "-1" ) Long entrepriseId) 
    {
        return userLogsRepository.userLogsDeEntrepriseId(entrepriseId);
    }
    
    
}
