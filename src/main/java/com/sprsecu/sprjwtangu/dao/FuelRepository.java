package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Fuel;
import java.util.List;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author vdnh
 */
public interface FuelRepository extends JpaRepository<Fuel, Long>{
    @Query("select f from Fuel f where f.idOwner = :x")
    public List<Fuel> fuelsOwner(@Param("x") Long idOwner);    
}