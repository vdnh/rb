package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ListDeRecherche;
import java.util.Date;
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
public interface ListDeRechercheRepository extends JpaRepository<ListDeRecherche, Long>{
       
    @Query("select l from ListDeRecherche l where l.id_shipper = :x")
    public List<ListDeRecherche> listDeRecherchesDeShipper(@Param("x") Long id_shipper);    
    
    @Query("select l from ListDeRecherche l where l.dateRecherche = :x")
    public Page<ListDeRecherche> findAllWithDateRecherche(@Param("x") Date mc, Pageable pageable);    
    
}
