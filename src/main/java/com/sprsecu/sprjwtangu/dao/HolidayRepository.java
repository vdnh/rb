package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Holiday;
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
public interface HolidayRepository extends JpaRepository<Holiday, Long>{
    @Query("select h from Holiday h where h.idOwner = :x")
    public List<Holiday> holidaysOwner(@Param("x") Long idOwner);    
}
