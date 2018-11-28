/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
//@RestResource
public interface UserRepository extends JpaRepository<AppUser, Long>{
    public AppUser findByUsername(String username);    
}
