package com.sprsecu.sprjwtangu.controller;

//import com.sprsecu.sprjwtangu.dao.TaskRepository;
//import com.sprsecu.sprjwtangu.entities.Task;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    
    @GetMapping("/userInfo/{userName}")
    public AppUser user(@PathVariable String userName){
        return userRepository.findByUsername(userName);
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
