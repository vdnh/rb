package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Transport;
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
public interface TransportRepository  extends JpaRepository<Transport, Long>{
    @Query("select t from Transport t where (t.origin like :x or t.destination like :x) ")
    public Page<Transport> chercher(@Param("x") String mc,  Pageable pageable);  
    
    public List<Transport> findByIdEntreprise(Long Transport);
    
    public List<Transport> findByIdTransporter(Long idTransporter);
    
    @Query("select t from Transport t where (t.idTransporter = :y and t.typeDoc = 2 and t.valid = 1) order by t.id desc ")
    public Page<Transport> commandsOfTransporterPaged(@Param("y") Long idTransporter,  Pageable pageable);  
    
    @Query("select t from Transport t where (t.idTransporter = :y and t.typeDoc = 1) order by t.id desc ")
    public Page<Transport> evaluatiosOfTransporterPaged(@Param("y") Long idTransporter,  Pageable pageable);  
}
