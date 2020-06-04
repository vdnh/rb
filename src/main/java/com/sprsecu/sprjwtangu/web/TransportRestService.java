package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.TransportModelRepository;
import com.sprsecu.sprjwtangu.dao.TransportRepository;
import com.sprsecu.sprjwtangu.entities.Transport;
import com.sprsecu.sprjwtangu.entities.TransportModel;
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
    @Autowired
    private TransportModelRepository transportModelRepository;
    
    //* functions for TransportModel
    @RequestMapping(value = "/transportModels", method = RequestMethod.GET)
    public List<TransportModel> getTransportModels(){
        return transportModelRepository.findAll();
    }
    
    // All transports of un entreprise
    @RequestMapping(value = "/transportModelsEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<TransportModel> getTransportModelsEntreprise(@PathVariable Long idEntreprise){
        return transportModelRepository.findByIdEntreprise(idEntreprise);
    }
    
    // All transports of un transporter
    @RequestMapping(value = "/transportsTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Transport> getTransportsTransporter(@PathVariable Long idTransporter){
        return transportRepository.findByIdTransporter(idTransporter);
    }
    
    
    @RequestMapping(value = "/transportModels", method = RequestMethod.POST)
    public TransportModel save(@RequestBody TransportModel t){
        return transportModelRepository.save(t);
    }
    
    @RequestMapping(value = "/transportModels/{id}", method = RequestMethod.DELETE)
    public boolean supprimerTransportModel(@PathVariable Long id){
        transportModelRepository.deleteById(id);
        return true;
    }
    // end of functions for TransportModel*/
    
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
