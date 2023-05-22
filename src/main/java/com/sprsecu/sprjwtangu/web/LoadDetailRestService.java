package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.LoadDetailRepository;
import com.sprsecu.sprjwtangu.entities.LoadDetail;
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
public class LoadDetailRestService {
@Autowired
    private LoadDetailRepository loadDetailRepository;
    
    @RequestMapping(value = "/loadDetails", method = RequestMethod.GET)
    public List<LoadDetail> getLoadDetails(){
        return loadDetailRepository.findAll();
    }
    
    @RequestMapping(value = "/loadDetails/{id}", method = RequestMethod.GET)
    public LoadDetail getLoadDetail(@PathVariable Long id){
        return loadDetailRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/loadDetails", method = RequestMethod.POST)
    public LoadDetail save(@RequestBody LoadDetail l){
        return loadDetailRepository.save(l);
    }
    
    @RequestMapping(value = "/loadDetails/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        loadDetailRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/loadDetails", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        loadDetailRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/loadDetails/{id}", method = RequestMethod.PUT)
    public LoadDetail updateLoadDetail(@PathVariable Long id, @RequestBody LoadDetail l){
        l.setId(id);
        return loadDetailRepository.save(l);
    }

    @RequestMapping(value = "/loadDetailsDeTransport", method = RequestMethod.GET)
    public List<LoadDetail> chercherLDT(@RequestParam(name = "idTransport", defaultValue = "-1" ) Long idTransport) 
    {
        return loadDetailRepository.findByIdTransport(idTransport);
    }    
}
