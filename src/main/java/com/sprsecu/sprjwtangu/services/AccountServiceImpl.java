package com.sprsecu.sprjwtangu.services;

import com.sprsecu.sprjwtangu.dao.RoleRepository;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author vdnh
 */
@Service
@Transactional
public class AccountServiceImpl implements AccountService{
    
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public AppUser saveUser(AppUser user) {
        String hashPW = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(hashPW);
        return userRepository.save(user);
    }

    @Override
    public AppRole saveRole(AppRole role) {
        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        AppRole role = roleRepository.findByRoleName(roleName);
        AppUser user = userRepository.findByUsername(username);
        user.getRoles().add(role);
    }

    @Override
    public AppUser findUserByUsername(String username) {
        //System.out.println("Before of find user by username");
        AppUser user= userRepository.findByUsername(username); 
        //System.out.println("Later of find user by username : "+user.getPassword());
        return user;
    }
    
    @Override
    public List<AppUser> getAllUsersByIdUser(Long  idUser) {
        //System.out.println("Before of find user by username");
        List<AppUser> users= userRepository.getAllUsersByIdUser(idUser); 
        //System.out.println("Later of find user by username : "+user.getPassword());
        return users;
    }
    
//    public List<AppUser> getAllUsersByIdTransporter(Long idTransporter);
    @Override
    public List<AppUser> getAllUsersByIdTransporter(Long  idTransporter) {
        //System.out.println("Before of find user by username");
        List<AppUser> users= userRepository.getAllUsersByIdTransporter(idTransporter); 
        //System.out.println("Later of find user by username : "+user.getPassword());
        return users;
    }
    
    
    @Override
    public List<AppUser> getAllUsers(){
        return userRepository.findAll();
    }
    
    @Override
    public void delUser(AppUser user){
        userRepository.deleteById(user.getId());
    }
    
}
