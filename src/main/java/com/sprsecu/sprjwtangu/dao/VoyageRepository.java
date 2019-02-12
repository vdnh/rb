package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Voyage;
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
public interface VoyageRepository extends JpaRepository<Voyage, Long>{
    @Query("select v from Voyage v where v.idDemander = :x")
    public List<Voyage> voyagesDeTransporter(@Param("x") Long idDemander);
    
    @Query("select v from Voyage v where v.origin like :x or v.destination like :x")
    public Page<Voyage> chercher(@Param("x") String mc, Pageable pageable);       
}
