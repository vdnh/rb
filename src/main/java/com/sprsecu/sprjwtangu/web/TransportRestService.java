package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.TransportRepository;
import com.sprsecu.sprjwtangu.entities.Transport;
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
public class TransportRestService {
            
    @Autowired
    private TransportRepository transportRepository;
    
    @RequestMapping(value = "/transports", method = RequestMethod.GET)
    public List<Transport> getTransports(){
        return transportRepository.findAll();
    }
    
    @RequestMapping(value = "/transportsEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<Transport> getTransportsEntreprise(@PathVariable Long idEntreprise){
        return transportRepository.findByIdEntreprise(idEntreprise);
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.GET)
    public Transport getTransport(@PathVariable Long id){
        return transportRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/transports", method = RequestMethod.POST)
    public Transport save(@RequestBody Transport t){
        return transportRepository.save(t);
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        transportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transports", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        transportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.PUT)
    public Transport updateTransport(@PathVariable Long id, @RequestBody Transport t){
        t.setId(id);
        return transportRepository.save(t);
    }    
    
    @RequestMapping(value = "/chercherTransports", method = RequestMethod.GET)
    public Page<Transport> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return transportRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
}
