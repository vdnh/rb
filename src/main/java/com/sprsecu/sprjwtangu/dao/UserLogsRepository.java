package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Camion;
import com.sprsecu.sprjwtangu.entities.UserLogs;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface UserLogsRepository  extends JpaRepository<UserLogs, Long>{
    @Query("select userLogs from UserLogs userLogs where userLogs.usernameLogin like :x")
    public Page<UserLogs> userLogsDeUsernameLogin(@Param("x") String mc, Pageable pageable);    
       
    @Query("select userLogs from UserLogs userLogs where userLogs.entrepriseId = :x")
    public List<UserLogs> userLogsDeEntrepriseId(@Param("x") Long entrepriseId);
    
}
