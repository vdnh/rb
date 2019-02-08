package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Demande;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface DemandeRepository extends JpaRepository<Demande, Long>{
    @Query("select d from Demande d where d.idDemandeur = :x and d.roleDemander like 'TRANSPORTER'")
    public List<Demande> demandesDeTransporter(@Param("x") Long idDemandeur);
    
    @Query("select d from Demande d where d.idDemandeur = :x and d.roleDemander like 'SHIPPER'")
    public List<Demande> demandesDeShipper(@Param("x") Long idDemandeur);
}
