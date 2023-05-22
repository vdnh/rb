/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Itineraire;
import com.sprsecu.sprjwtangu.entities.ItineraireLeger;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author admin
 */
public interface ItineraireRepository extends JpaRepository<Itineraire, Long>{
//    public List<Itineraire> findByIdTransporter(Long idTransporter);
//    public List<Itineraire> findByIdEntreprise(Long idEntreprise);
//    public List<Itineraire> findByIdCamion(Long idCamion);
    
    @Query("select it from Itineraire it where ((it.datePick >= CURDATE() - 15 or (it.datePick >= CURDATE() - 85 and it.datePick <= CURDATE() - 67)) and it.idTransporter = :y) order by it.id desc ")
    public List<Itineraire> findByIdTransporter(@Param("y") Long idTransporter);  
    
    @Query("select it from Itineraire it where ((it.datePick >= CURDATE() - 15 or (it.datePick >= CURDATE() - 85 and it.datePick <= CURDATE() - 67)) and it.idEntreprise = :y) order by it.id desc ")
    public List<Itineraire> findByIdEntreprise(@Param("y") Long idEntreprise);
    
    @Query("select it from Itineraire it where ((it.datePick >= CURDATE() - 15 or (it.datePick >= CURDATE() - 85 and it.datePick <= CURDATE() - 67)) and it.idCamion = :y) order by it.id desc ")
    public List<Itineraire> findByIdCamion(@Param("y") Long idCamion);

    
    public Itineraire findByIdTransport(Long idTransport);
//    public List<ItineraireLeger> findByIdCamionItileger(Long idCamion);
}
