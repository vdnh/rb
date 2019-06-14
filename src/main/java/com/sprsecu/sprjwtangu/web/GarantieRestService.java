package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.GarantieRepository;
import com.sprsecu.sprjwtangu.entities.Garantie;
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
 * @author admin
 */

@RestController
@CrossOrigin("*")
public class GarantieRestService {
    @Autowired
    private GarantieRepository garantieRepository;
    
    @RequestMapping(value = "/garanties", method = RequestMethod.GET)
    public List<Garantie> getGaranties(){
        return garantieRepository.findAll();
    }
    
    @RequestMapping(value = "/garanties/{id}", method = RequestMethod.GET)
    public Garantie getGarantie(@PathVariable Long id){
        return garantieRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/garanties", method = RequestMethod.POST)
    public Garantie save(@RequestBody Garantie g){
        return garantieRepository.save(g);
    }
    
    @RequestMapping(value = "/garanties/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        garantieRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/garanties", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        garantieRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/garanties/{id}", method = RequestMethod.PUT)
    public Garantie updateGarantie(@PathVariable Long id, @RequestBody Garantie g){
        g.setId(id);
        return garantieRepository.save(g);
    }

    @RequestMapping(value = "/garantiesDeCamion", method = RequestMethod.GET)
    public List<Garantie> chercherRDC(@RequestParam(name = "idCamion", defaultValue = "-1" ) Long idCamion) 
    {
        return garantieRepository.findByIdCamion(idCamion);
    }        
}
