/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ConfirmTransport;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author admin
 */
public interface ConfirmTransportRepository extends JpaRepository<ConfirmTransport, Long>{
//    @Query("select c from ConfirmTransport c where c.formNumero like :x")
//    public Page<ConfirmTransport> chercherFormNumero(@Param("x") String mc, Pageable pageable);   
    
    @Query("select c from ConfirmTransport c where c.idTransporter = :x and c.formNumero like :y")
    public ConfirmTransport findByFormNumero(@Param("x") Long idTransporter, @Param("y") String formNumero);
       
    @Query("select c from ConfirmTransport c where c.idTransporter = :x")
    public List<ConfirmTransport> confirmTransportsDeTransporter(@Param("x") Long idTransporter);
    
//    @Query("select c from Confirmation c where c.uniteMonitor like :x and c.monitor like :y")
//    public Camion camionMonitoring(@Param("x") String uniteMonitor, @Param("y") String monitor);
}