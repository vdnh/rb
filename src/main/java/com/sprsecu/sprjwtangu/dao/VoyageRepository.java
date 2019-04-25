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
    @Query("select v from Voyage v where v.idTransporter = :x")
    public List<Voyage> voyagesDeTransporter(@Param("x") Long idTransporter);
    
    @Query("select v from Voyage v where v.origin like :x or v.destination like :x")
    public Page<Voyage> chercher(@Param("x") String mc, Pageable pageable);       
    
    @Query("select v from Voyage v where v.typeCamion like :t and v.optionVoyage like :o") // and v.dateDepart<= :d")
    public List<Voyage> matching(
            @Param("t") String typeCamion
            ,@Param("o") String optionVoyage
            //,@Param("d") String dateDepart
            );
    @Query("select v from Voyage v where v.id in (:mv)")
    public List<Voyage> matchedVoyages(
            @Param("mv") String typeCamion
            );
}
