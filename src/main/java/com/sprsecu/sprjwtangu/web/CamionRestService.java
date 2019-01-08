package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.entities.Camion;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
public class CamionRestService {
    
    @Autowired
    private CamionRepository camionRepository;
    
    @RequestMapping(value = "/camions", method = RequestMethod.GET)
    public List<Camion> getCamions(){
        return camionRepository.findAll();
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.GET)
    public Camion getCamion(@PathVariable Long id){
        return camionRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/camions", method = RequestMethod.POST)
    public Camion save(@RequestBody Camion c){
        return camionRepository.save(c);
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        camionRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camions", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        camionRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.PUT)
    public Camion updateCamion(@PathVariable Long id, @RequestBody Camion c){
        c.setId(id);
        return camionRepository.save(c);
    }    
    
    @RequestMapping(value = "/chercherPlaque", method = RequestMethod.GET)
    public Page<Camion> chercherPlaque(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return camionRepository.chercherPlaque("%"+mc+"%", PageRequest.of(page, size));
    }    
    
    @RequestMapping(value = "/camionsDeTransporter", method = RequestMethod.GET)
    public List<Camion> chercherCDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return camionRepository.camionsDeTransporter(idTransporter);
    }
}
