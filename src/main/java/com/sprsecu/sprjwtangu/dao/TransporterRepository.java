package com.sprsecu.sprjwtangu.dao;


import com.sprsecu.sprjwtangu.entities.Transporter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author admin
 */
public interface TransporterRepository extends JpaRepository<Transporter, Long>{
    @Query("select t from Transporter t where t.nom like :x")
    public Page<Transporter> chercher(@Param("x") String mc, Pageable pageable);
}

