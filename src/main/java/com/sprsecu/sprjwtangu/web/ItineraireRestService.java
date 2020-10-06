/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ItineraireRepository;
import com.sprsecu.sprjwtangu.entities.Itineraire;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 */
@RestController
@CrossOrigin("*")
public class ItineraireRestService {
    @Autowired
    private ItineraireRepository itineraireRepository;
    
    // All itineraires of un transporter
    @RequestMapping(value = "/itinerairesTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesTransporter(@PathVariable Long idTransporter){
        return itineraireRepository.findByIdTransporter(idTransporter);
    }
    
    // All itineraires of a truck
    @RequestMapping(value = "/itinerairesCamion/{idCamion}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesCamion(@PathVariable Long idCamion){
        return itineraireRepository.findByIdCamion(idCamion);
    }
    
    @RequestMapping(value = "/itineraires", method = RequestMethod.GET)
    public List<Itineraire> getItineraires(){
        return itineraireRepository.findAll();
    }
    
    @RequestMapping(value = "/itinerairesEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesEntreprise(@PathVariable Long idEntreprise){
        return itineraireRepository.findByIdEntreprise(idEntreprise);
    }
    
    @RequestMapping(value = "/itineraires/{id}", method = RequestMethod.GET)
    public Itineraire getItineraire(@PathVariable Long id){
        return itineraireRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/itineraires", method = RequestMethod.POST)
    public Itineraire save(@RequestBody Itineraire i){
        return itineraireRepository.save(i);
    }
    
    @RequestMapping(value = "/itineraires/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        itineraireRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/itineraires", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        itineraireRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/itineraires/{id}", method = RequestMethod.PUT)
    public Itineraire updateItineraire(@PathVariable Long id, @RequestBody Itineraire i){
        i.setId(id);
        return itineraireRepository.save(i);
    }
}
