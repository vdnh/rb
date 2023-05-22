package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ExpenseFixed;
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
public interface ExpenseFixedRepository extends JpaRepository<ExpenseFixed, Long>{
    @Query("select e from ExpenseFixed e where e.idOwner = :x")
    public List<ExpenseFixed> expenseFixedsOwner(@Param("x") Long idOwner);    
}