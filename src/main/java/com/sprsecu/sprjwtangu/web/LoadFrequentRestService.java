package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.LoadFrequentRepository;
import com.sprsecu.sprjwtangu.entities.LoadFrequent;
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
public class LoadFrequentRestService {
@Autowired
    private LoadFrequentRepository loadFrequentRepository;
    
    @RequestMapping(value = "/loadFrequents", method = RequestMethod.GET)
    public List<LoadFrequent> getLoadFrequents(){
        return loadFrequentRepository.findAll();
    }
    
    @RequestMapping(value = "/loadFrequents/{id}", method = RequestMethod.GET)
    public LoadFrequent getLoadFrequent(@PathVariable Long id){
        return loadFrequentRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/loadFrequents", method = RequestMethod.POST)
    public LoadFrequent save(@RequestBody LoadFrequent l){
        return loadFrequentRepository.save(l);
    }
    
    @RequestMapping(value = "/loadFrequents/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        loadFrequentRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/loadFrequents", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        loadFrequentRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/loadFrequents/{id}", method = RequestMethod.PUT)
    public LoadFrequent updateLoadFrequent(@PathVariable Long id, @RequestBody LoadFrequent l){
        l.setId(id);
        return loadFrequentRepository.save(l);
    }

    @RequestMapping(value = "/loadFrequentsDeTransporter", method = RequestMethod.GET)
    public List<LoadFrequent> chercherLFT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return loadFrequentRepository.findByIdTransporter(idTransporter);
    }    
    
    @RequestMapping(value = "/loadFrequentsDeShipper", method = RequestMethod.GET)
    public List<LoadFrequent> chercherLFS(@RequestParam(name = "idShipper", defaultValue = "-1" ) Long idShipper) 
    {
        return loadFrequentRepository.findByIdShipper(idShipper);
    }
}
