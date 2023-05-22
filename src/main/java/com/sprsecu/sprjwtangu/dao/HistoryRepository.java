package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.History;
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
public interface HistoryRepository extends JpaRepository<History, Long>{
    @Query("select h from History h where h.idOwner = :x")
    public List<History> historiesOwner(@Param("x") Long idOwner);    
}
