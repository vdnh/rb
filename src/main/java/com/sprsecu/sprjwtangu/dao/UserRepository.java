package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RestResource;

/**
 *
 * @author vdnh
 */
//@RestResource
public interface UserRepository extends JpaRepository<AppUser, Long>{
    public AppUser findByUsername(String username);    
}
