package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ReparationRepository;
import com.sprsecu.sprjwtangu.entities.Reparation;
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
public class ReparationRestService {
@Autowired
    private ReparationRepository reparationRepository;
    
    @RequestMapping(value = "/reparations", method = RequestMethod.GET)
    public List<Reparation> getReparations(){
        return reparationRepository.findAll();
    }
    
    @RequestMapping(value = "/reparations/{id}", method = RequestMethod.GET)
    public Reparation getReparation(@PathVariable Long id){
        return reparationRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/reparations", method = RequestMethod.POST)
    public Reparation save(@RequestBody Reparation r){
        return reparationRepository.save(r);
    }
    
    @RequestMapping(value = "/reparations/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        reparationRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reparations", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        reparationRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reparations/{id}", method = RequestMethod.PUT)
    public Reparation updateReparation(@PathVariable Long id, @RequestBody Reparation r){
        r.setId(id);
        return reparationRepository.save(r);
    }

    @RequestMapping(value = "/reparationsDeBon", method = RequestMethod.GET)
    public List<Reparation> chercherRDC(@RequestParam(name = "idBon", defaultValue = "-1" ) Long idBon) 
    {
        return reparationRepository.findByIdBon(idBon);
    }    
}
