package com.sprsecu.sprjwtangu;

import com.sprsecu.sprjwtangu.dao.RoleRepository;
//import com.sprsecu.sprjwtangu.dao.TaskRepository;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
//import com.sprsecu.sprjwtangu.entities.Task;
import com.sprsecu.sprjwtangu.services.AccountService;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SprjwtanguApplication implements CommandLineRunner{
    //@Autowired
    //private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    AccountService  accountService;
    
    public static void main(String[] args) {
            SpringApplication.run(SprjwtanguApplication.class, args);
    }

/*/    
    @Bean
    public BCryptPasswordEncoder getBCPE(){
        return new BCryptPasswordEncoder();
    }
//*/
    @Override
    public void run(String... args) throws Exception {
        /*
        taskRepository.save(new Task(Long.getLong("1"), "task01"));
        taskRepository.save(new Task(Long.getLong("2"), "task02"));
        Stream.of("ADMIN","USER","MANAGER").forEach(r->{
            //roleRepository.save(new AppRole(null, r));
            accountService.saveRole(new AppRole(null, r));
        });
        roleRepository.findAll().forEach(r -> {
            System.out.println("Role : " + r.getRoleName());
        });
        
        Stream.of("admin","user","manager").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, u.toUpperCase());
            //userRepository.save(new AppUser(null, u, u, null));
        });
        accountService.addRoleToUser("admin", "USER");
        accountService.addRoleToUser("admin", "MANAGER");
        accountService.addRoleToUser("manager", "USER");
        userRepository.findAll().forEach(u -> {
            System.out.println("User : "+u.getUsername()+" - Role : "+u.getRoles().toString());
        });
        
        Stream.of("T1","T2","T3").forEach(t->{
            taskRepository.save(new Task(null, t));
        });
        taskRepository.findAll().forEach(t ->{
            System.out.println("taskName : "+t.getTaskName());
        });
        //*/
        
        /*/ for shipper and transporter
        Stream.of("SHIPPER","TRANSPORTER").forEach(r->{
            accountService.saveRole(new AppRole(null, r));
        });
        roleRepository.findAll().forEach(r -> {
            System.out.println("Role : " + r.getRoleName());
        });
        //*/
        /*//
        Stream.of("shipper1","shipper2").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, "SHIPPER");
            //userRepository.save(new AppUser(null, u, u, null));
        });
        //accountService.addRoleToUser("shipper", "SHIPPER");
        //accountService.addRoleToUser("transporter", "TRANSPORTER");
        userRepository.findAll().forEach(u -> {
            System.out.println("User : "+u.getUsername()+" - Role : "+u.getRoles().toString());
        });
        //*/
    }
}
