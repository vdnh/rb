/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ItineraireRepository;
import com.sprsecu.sprjwtangu.entities.Itineraire;
import com.sprsecu.sprjwtangu.entities.ItineraireLeger;
import java.util.ArrayList;
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
    
    // itineraire of a transport if thereis
    @RequestMapping(value = "/itineraireTransport/{idTransport}", method = RequestMethod.GET)
    public Itineraire getItineraireTransport(@PathVariable Long idTransport){
        return itineraireRepository.findByIdTransport(idTransport);
    }
    
    // All itineraires of un transporter
    @RequestMapping(value = "/itinerairesTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesTransporter(@PathVariable Long idTransporter){
        return itineraireRepository.findByIdTransporter(idTransporter);
    }
    
    // All itineraires leger of un transporter
    @RequestMapping(value = "/itinerairesLegerTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesLegerTransporter(@PathVariable Long idTransporter){
        List<Itineraire> temp = new ArrayList<>();
        itineraireRepository.findByIdTransporter(idTransporter).forEach(iti->{
            iti.setImgUrl("");
            temp.add(iti);
        });
        return temp;
    }
    
    // All itineraires of a truck
    @RequestMapping(value = "/itinerairesCamion/{idCamion}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesCamion(@PathVariable Long idCamion){
        return itineraireRepository.findByIdCamion(idCamion);
    }
    
    // All itineraires leger of a truck without image
    @RequestMapping(value = "/itinerairesLegerCamion/{idCamion}", method = RequestMethod.GET)
    public List<Itineraire> getItinerairesLegerCamion(@PathVariable Long idCamion){
        List<Itineraire> temp = new ArrayList<>(); 
        itineraireRepository.findByIdCamion(idCamion).forEach(iti->{
            iti.setImgUrl("");
            temp.add(iti);
        });
        return temp;
//        return (<ItineraireLeger>) itineraireRepository.findByIdCamion(idCamion);
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
        // if itiner/route in body already existe and image data no here
        // we keep the image of orinal itiner/route, if origanl have image
        if(i.getId()!=null && i.getId()>0 && 
            (i.getImgUrl()==null || i.getImgUrl().length()<5))
        {
            // get origin itineraire/route
            Itineraire temp = itineraireRepository.getOne(i.getId());
            // check data image of original
            if(temp.getImgUrl()!=null && temp.getImgUrl().length()>5)
            {
                i.setImgUrl(temp.getImgUrl());
                System.out.println("Itiner/Route original has image");
            }
            else{
                System.out.println("Itiner/Route original no image");
            }
            
            System.out.println("Itineraire/Route existed and no image in body");
            return itineraireRepository.save(i);
        }
        System.out.println("A new Itineraire/Route - Or - Itiner/Route contains image in body");
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
