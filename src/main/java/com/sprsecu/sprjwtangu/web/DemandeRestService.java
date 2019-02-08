package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.DemandeRepository;
import com.sprsecu.sprjwtangu.entities.Demande;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
public class DemandeRestService {
        
    @Autowired
    private DemandeRepository demandeRepository;
    
    @RequestMapping(value = "/demandes", method = RequestMethod.GET)
    public List<Demande> getDemandes(){
        return demandeRepository.findAll();
    }
    
    @RequestMapping(value = "/demandes/{id}", method = RequestMethod.GET)
    public Demande getDemande(@PathVariable Long id){
        return demandeRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/demandes", method = RequestMethod.POST)
    public Demande save(@RequestBody Demande d){
        return demandeRepository.save(d);
    }
    
    @RequestMapping(value = "/demandes/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        demandeRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/demandes", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        demandeRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/demandes/{id}", method = RequestMethod.PUT)
    public Demande updateCamion(@PathVariable Long id, @RequestBody Demande d){
        d.setId(id);
        return demandeRepository.save(d);
    }    
        
    @RequestMapping(value = "/demandesDeTransporter", method = RequestMethod.GET)
    public List<Demande> chercherDdT(@RequestParam(name = "idDemandeur", defaultValue = "-1" ) Long idDemandeur) 
    {
        return demandeRepository.demandesDeTransporter(idDemandeur);
    }
    
    @RequestMapping(value = "/demandesDeShipper", method = RequestMethod.GET)
    public List<Demande> chercherDdS(@RequestParam(name = "idShipper", defaultValue = "-1" ) Long idShipper) 
    {
        return demandeRepository.demandesDeShipper(idShipper);
    }
}
