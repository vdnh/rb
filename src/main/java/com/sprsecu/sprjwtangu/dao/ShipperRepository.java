package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Shipper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface ShipperRepository  extends JpaRepository<Shipper, Long>{
    @Query("select s from Shipper s where s.nom like :x")
    public Page<Shipper> chercher(@Param("x") String mc, Pageable pageable);    
}
