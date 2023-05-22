package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.RemorquageRepository;
import com.sprsecu.sprjwtangu.entities.Remorquage;
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
public class RemorquageRestService {
            
    @Autowired
    private RemorquageRepository remorquageRepository;
    
    @RequestMapping(value = "/remorquages", method = RequestMethod.GET)
    public List<Remorquage> getRemorquages(){
        return remorquageRepository.findAll();
    }
    
    // All remorquage of un shipper - client pro
    @RequestMapping(value = "/remorquagesEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<Remorquage> getRemorquagesEntreprise(@PathVariable Long idEntreprise){
        return remorquageRepository.findByIdEntreprise(idEntreprise);
    }
    
    // All remorquage of un transporter
    @RequestMapping(value = "/remorquagesTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Remorquage> getRemorquagesTransporter(@PathVariable Long idTransporter){
        return remorquageRepository.findByIdTransporter(idTransporter);
    }
    
    @RequestMapping(value = "/remorquages/{id}", method = RequestMethod.GET)
    public Remorquage getRemorquage(@PathVariable Long id){
        return remorquageRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/remorquages", method = RequestMethod.POST)
    public Remorquage save(@RequestBody Remorquage r){
        return remorquageRepository.save(r);
    }
    
    @RequestMapping(value = "/remorquages/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        remorquageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/remorquages", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        remorquageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/remorquages/{id}", method = RequestMethod.PUT)
    public Remorquage updateRemorquage(@PathVariable Long id, @RequestBody Remorquage r){
        r.setId(id);
        return remorquageRepository.save(r);
    }    
    
    @RequestMapping(value = "/chercherRemorquages", method = RequestMethod.GET)
    public Page<Remorquage> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return remorquageRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
}
