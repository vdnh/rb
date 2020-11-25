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

/**
 *
 * @author admin
 */
public interface ItineraireRepository extends JpaRepository<Itineraire, Long>{
    public List<Itineraire> findByIdTransporter(Long idTransporter);
    public List<Itineraire> findByIdEntreprise(Long idEntreprise);
    public List<Itineraire> findByIdCamion(Long idCamion);
    public Itineraire findByIdTransport(Long idTransport);
//    public List<ItineraireLeger> findByIdCamionItileger(Long idCamion);
}
