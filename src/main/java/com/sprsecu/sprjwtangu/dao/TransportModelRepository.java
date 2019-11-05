package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Transport;
import com.sprsecu.sprjwtangu.entities.TransportModel;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author 
 */
public interface TransportModelRepository  extends JpaRepository<TransportModel, Long>{
    
    @Query("select t from TransportModel t where (t.origin like :t or t.destination like :x) ")
    public Page<TransportModel> chercher(@Param("x") String mc,  Pageable pageable);  
    
    public List<TransportModel> findByIdEntreprise(Long Transport);

}
