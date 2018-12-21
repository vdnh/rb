package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.CamionFermee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface CamionFermeeRepository extends JpaRepository<CamionFermee, Long>{
    @Query("select c from CamionFermee c where c.id_camion = :x")
    public CamionFermee camionFermeeDeCamion(@Param("x") Long id_camion);
    
//    @Query("select l from ListDeRecherche l where l.id_shipper = :x")
//    public List<ListDeRecherche> listDeRecherchesDeShipper(@Param("x") Long id_shipper);    
}
