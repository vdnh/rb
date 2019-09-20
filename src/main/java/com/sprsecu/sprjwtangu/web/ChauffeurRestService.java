package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ChauffeurRepository;
import com.sprsecu.sprjwtangu.entities.Chauffeur;
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
public class ChauffeurRestService {
        @Autowired
    private ChauffeurRepository chauffeurRepository;
    
    @RequestMapping(value = "/chauffeurs", method = RequestMethod.GET)
    public List<Chauffeur> getChauffeurs(){
        return chauffeurRepository.findAll();
    }
    
    @RequestMapping(value = "/chauffeurs/{id}", method = RequestMethod.GET)
    public Chauffeur getChauffeur(@PathVariable Long id){
        return chauffeurRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/chauffeurs", method = RequestMethod.POST)
    public Chauffeur save(@RequestBody Chauffeur c){
        return chauffeurRepository.save(c);
    }
    
    @RequestMapping(value = "/chauffeurs/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        chauffeurRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/chauffeurs", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        chauffeurRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/chauffeurs/{id}", method = RequestMethod.PUT)
    public Chauffeur updateChauffeur(@PathVariable Long id, @RequestBody Chauffeur c){
        c.setId(id);
        //Chauffeur con = chauffeurRepository.getOne(id);
        //if (c.getEmail() == null) c.setEmail(con.getEmail());
        //if (c.getDateNaissance() == null) c.setDateNaissance(con.getDateNaissance());
        //if (c.getNom()== null) c.setNom(con.getNom());
        //if (c.getPrenom()== null) c.setPrenom(con.getPrenom());
        //if (c.getTel()== 0) c.setTel(con.getTel());
        //if (c.getPhoto()== null) c.setPhoto(con.getPhoto());        
        return chauffeurRepository.save(c);
    }    
    
    @RequestMapping(value = "/chercherChauffeurs", method = RequestMethod.GET)
    public Page<Chauffeur> chercher(
            @RequestParam(name = "mc", defaultValue = "") String mc, 
            @RequestParam(name = "page", defaultValue = "0")int page, 
            @RequestParam(name = "size", defaultValue = "5")int size){
        //Pageable pb = (Pageable) PageRequest.of(page,size);
        return chauffeurRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
    
    @RequestMapping(value = "/chauffeursDeTransporter", method = RequestMethod.GET)
    public List<Chauffeur> chercherCDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return chauffeurRepository.chauffeursDeTransporter(idTransporter);
    }    
    
    @RequestMapping(value = "/chauffeurSignUp", method = RequestMethod.POST)
    public Chauffeur saveSignUp(@RequestBody Chauffeur c){
        return chauffeurRepository.save(c);
    }
}
