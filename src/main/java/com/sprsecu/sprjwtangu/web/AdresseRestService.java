package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.AdresseRepository;
import com.sprsecu.sprjwtangu.entities.Adresse;
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
public class AdresseRestService {
@Autowired
    private AdresseRepository adresseRepository;
    
    @RequestMapping(value = "/adresses", method = RequestMethod.GET)
    public List<Adresse> getAdresses(){
        return adresseRepository.findAll();
    }
    
    @RequestMapping(value = "/adresses/{id}", method = RequestMethod.GET)
    public Adresse getAdresse(@PathVariable Long id){
        return adresseRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/adresses", method = RequestMethod.POST)
    public Adresse save(@RequestBody Adresse c){
        return adresseRepository.save(c);
    }
    
    @RequestMapping(value = "/adresses/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        adresseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/adresses", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        adresseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/adresses/{id}", method = RequestMethod.PUT)
    public Adresse updateAdresse(@PathVariable Long id, @RequestBody Adresse a){
        a.setId(id);
        return adresseRepository.save(a);
    }    
    
    @RequestMapping(value = "/chercherCodePostal", method = RequestMethod.GET)
    public Page<Adresse> chercherCodePostal(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return adresseRepository.chercherCodePostal("%"+mc+"%", PageRequest.of(page, size));
    }    
    
    @RequestMapping(value = "/adressesDeShipper", method = RequestMethod.GET)
    public List<Adresse> chercherADS(@RequestParam(name = "id_shipper", defaultValue = "-1" ) Long id_shipper) 
    {
        return adresseRepository.adressesDeShipper(id_shipper);
    }
    
    @RequestMapping(value = "/adressesDeTransporter", method = RequestMethod.GET)
    public List<Adresse> chercherADT(@RequestParam(name = "id_transporter", defaultValue = "-1" ) Long id_transporter) 
    {
        return adresseRepository.adressesDeTransporter(id_transporter);
    }
    
    @RequestMapping(value = "/adresseSignUp", method = RequestMethod.POST)
    public Adresse saveSignUp(@RequestBody Adresse c){
        return adresseRepository.save(c);
    }
}
