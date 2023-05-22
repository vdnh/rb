package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.CamionFermeeRepository;
import com.sprsecu.sprjwtangu.entities.CamionFermee;
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
public class CamionFermeeRestService {
    @Autowired
    private CamionFermeeRepository camionFermeeRepository;
    
    @RequestMapping(value = "/camionFermees", method = RequestMethod.GET)
    public List<CamionFermee> getCamionFermees(){
        return camionFermeeRepository.findAll();
    }
    
    @RequestMapping(value = "/camionFermees/{id}", method = RequestMethod.GET)
    public CamionFermee getCamionFermee(@PathVariable Long id){
        return camionFermeeRepository.getOne(id);
    }
    
    @RequestMapping(value = "/camionFermees", method = RequestMethod.POST)
    public CamionFermee save(@RequestBody CamionFermee c){
        return camionFermeeRepository.save(c);
    }
    
    @RequestMapping(value = "/camionFermees/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        camionFermeeRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camionFermees", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        camionFermeeRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camionFermees/{id}", method = RequestMethod.PUT)
    public CamionFermee updateCamionFermee(@PathVariable Long id, @RequestBody CamionFermee c){
        c.setId(id);
        return camionFermeeRepository.save(c);
    }    
    
    @RequestMapping(value = "/camionFermeeDeCamion", method = RequestMethod.GET)
    public CamionFermee chercherCfDC(@RequestParam(name = "id_camion", defaultValue = "-1" ) Long id_camion) 
    {
        return camionFermeeRepository.camionFermeeDeCamion(id_camion);
    }
}
