package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FlatBed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface FlatBedRepository extends JpaRepository<FlatBed, Long>{
    @Query("select f from FlatBed f where f.id_camion = :x")
    public  FlatBed flatBedDeCamion(@Param("x") Long id);     
}
