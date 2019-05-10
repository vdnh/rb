package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Demande;
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
public interface DemandeRepository extends JpaRepository<Demande, Long>{
    @Query("select d from Demande d where d.idDemander = :x and d.roleDemander like 'TRANSPORTER'")
    public List<Demande> demandesDeTransporter(@Param("x") Long idDemander);
    /*
    @Query("select d from Demande d where (d.origin like :x or d.destination like :x) "
            + "and instr(concat(',', d.idsUsersPasBesoins, ','), concat(',', :id, ','))=0")
    public Page<Demande> chercher(
            @Param("x") String mc, 
            @Param("id") String id, 
            Pageable pageable);   //*/
    
    @Query("select d from Demande d where (d.origin like :x or d.destination like :x) ")
    public Page<Demande> chercher(
            @Param("x") String mc,  
            Pageable pageable);   
    /*    
    @Query("select v from Voyage v where (v.origin like :x or v.destination like :x) "
            + "and instr(concat(',', v.idsUsersPasBesoins, ','), concat(',', :id, ','))=0")
    public Page<Voyage> chercher(
            @Param("x") String mc, 
            @Param("id") String id, 
            Pageable pageable);//*/
    
    @Query("select d from Demande d where d.idDemander = :x and d.roleDemander like 'SHIPPER'")
    public List<Demande> demandesDeShipper(@Param("x") Long idDemander);
}
