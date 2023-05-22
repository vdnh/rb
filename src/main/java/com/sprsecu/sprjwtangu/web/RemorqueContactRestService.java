package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.RemorqueContactRepository;
import com.sprsecu.sprjwtangu.entities.RemorqueContact;
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
public class RemorqueContactRestService {
                
    @Autowired
    private RemorqueContactRepository remorqueContactRepository;
    
    @RequestMapping(value = "/remorqueContacts", method = RequestMethod.GET)
    public List<RemorqueContact> getRemorqueContacts(){
        return remorqueContactRepository.findAll();
    }
    
    @RequestMapping(value = "/remorqueContacts/{id}", method = RequestMethod.GET)
    public RemorqueContact getRemorqueContact(@PathVariable Long id){
        return remorqueContactRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/remorqueContacts", method = RequestMethod.POST)
    public RemorqueContact save(@RequestBody RemorqueContact r){
        return remorqueContactRepository.save(r);
    }
    
    @RequestMapping(value = "/remorqueContacts/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        remorqueContactRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/remorqueContacts", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        remorqueContactRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/remorqueContacts/{id}", method = RequestMethod.PUT)
    public RemorqueContact updateRemorqueContact(@PathVariable Long id, @RequestBody RemorqueContact r){
        r.setId(id);
        return remorqueContactRepository.save(r);
    }
    
}
