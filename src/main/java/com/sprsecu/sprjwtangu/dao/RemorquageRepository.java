package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Remorquage;
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
public interface RemorquageRepository extends JpaRepository<Remorquage, Long>{
    
    @Query("select r from Remorquage r where (r.origin like :x or r.destination like :x) ")
    public Page<Remorquage> chercher(@Param("x") String mc,  Pageable pageable);  
    
    public List<Remorquage> findByIdEntreprise(Long idEntreprise);
    
    public List<Remorquage> findByIdTransporter(Long idTransporter);
}
