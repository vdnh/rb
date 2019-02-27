package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.BankClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface BankClientRepository extends JpaRepository<BankClient, Long>{
        @Query("select c from BankClient c where c.nom like :x")
    public Page<BankClient> chercher(@Param("x") String mc, Pageable pageable);

}
