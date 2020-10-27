package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Camion;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface CamionRepository  extends JpaRepository<Camion, Long>{
    @Query("select c from Camion c where c.plaque like :x")
    public Page<Camion> chercherPlaque(@Param("x") String mc, Pageable pageable);    
       
    @Query("select c from Camion c where c.idTransporter = :x")
    public List<Camion> camionsDeTransporter(@Param("x") Long idTransporter);
    
    @Query("select c from Camion c where c.uniteMonitor like :x and c.monitor like :y")
    public Camion camionMonitoring(@Param("x") String uniteMonitor, @Param("y") String monitor);
    
}
