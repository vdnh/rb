package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author vdnh
 */
@RepositoryRestResource
//@RestResource
public interface TaskRepository extends JpaRepository<Task, Long>{
    
}
