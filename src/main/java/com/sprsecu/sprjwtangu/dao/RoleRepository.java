package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
//@RestResource
public interface RoleRepository extends JpaRepository<AppRole, Long>{
    public AppRole findByRoleName(String roleName);
    
}
