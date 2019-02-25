package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.BonDeTravailRepository;
import com.sprsecu.sprjwtangu.entities.BonDeTravail;
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
public class BonDeTravailRestService {
    @Autowired
    private BonDeTravailRepository bonDeTravailRepository;
    
    @RequestMapping(value = "/bonDeTravails", method = RequestMethod.GET)
    public List<BonDeTravail> getBonDeTravails(){
        return bonDeTravailRepository.findAll();
    }
    
    @RequestMapping(value = "/bonDeTravails/{id}", method = RequestMethod.GET)
    public BonDeTravail getBonDeTravail(@PathVariable Long id){
        return bonDeTravailRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/bonDetravails", method = RequestMethod.POST)
    public BonDeTravail save(@RequestBody BonDeTravail c){
        return bonDeTravailRepository.save(c);
    }
    
    @RequestMapping(value = "/bonDeTravails/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        bonDeTravailRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/bonDeTravails", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        bonDeTravailRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/bonDeTravails/{id}", method = RequestMethod.PUT)
    public BonDeTravail updateBonDeTravail(@PathVariable Long id, @RequestBody BonDeTravail b){
        b.setId(id);
        return bonDeTravailRepository.save(b);
    }    
    
    
    @RequestMapping(value = "/bonDeTravailsDeCamion", method = RequestMethod.GET)
    public List<BonDeTravail> chercherBDC(@RequestParam(name = "idCamion", defaultValue = "-1" ) Long idCamion) 
    {
        return bonDeTravailRepository.findByIdCamion(idCamion);
    }    
}
