package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Chauffeur;
import java.util.List;
import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author vdnh
 * * © Nhat Hung VO DINH
 */
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long>{
    @Query("select c from Chauffeur c where c.nom like :x")
    public Page<Chauffeur> chercher(@Param("x") String mc, Pageable pageable);
    
    @Query("select c from Chauffeur c where c.idTransporter = :x")
    public List<Chauffeur> chauffeursDeTransporter(@Param("x") Long idTransporter);    
}
