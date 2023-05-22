package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ExpenseFlexible;
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
public interface ExpenseFlexibleRepository extends JpaRepository<ExpenseFlexible, Long>{
    @Query("select e from ExpenseFlexible e where e.idOwner = :x")
    public List<ExpenseFlexible> expenseFlexiblesOwner(@Param("x") Long idOwner);    
}