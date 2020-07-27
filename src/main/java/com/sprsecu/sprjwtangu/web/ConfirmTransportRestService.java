package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ConfirmTransportRepository;
import com.sprsecu.sprjwtangu.entities.ConfirmTransport;
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
public class ConfirmTransportRestService {
    @Autowired
    private ConfirmTransportRepository confirmTransportRepository;
    
    @RequestMapping(value = "/confirmTransports", method = RequestMethod.GET)
    public List<ConfirmTransport> getConfirmTransports(){
        return confirmTransportRepository.findAll();
    }
    
    @RequestMapping(value = "/confirmTransports/{id}", method = RequestMethod.GET)
    public ConfirmTransport getConfirmTransport(@PathVariable Long id){
        return confirmTransportRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/confirmTransports", method = RequestMethod.POST)
    public ConfirmTransport save(@RequestBody ConfirmTransport c){
        return confirmTransportRepository.save(c);
    }
    
    @RequestMapping(value = "/confirmTransports/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        confirmTransportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/confirmTransports", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        confirmTransportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/confirmTransports/{id}", method = RequestMethod.PUT)
    public ConfirmTransport updateConfirmTransport(@PathVariable Long id, @RequestBody ConfirmTransport c){
        c.setId(id);
        return confirmTransportRepository.save(c);
    }    
    
    
    @RequestMapping(value = "/confirmTransportsDeTransporter", method = RequestMethod.GET)
    public List<ConfirmTransport> chercherConfirmTransportDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return confirmTransportRepository.confirmTransportsDeTransporter(idTransporter);
    }
    
    @RequestMapping(value = "/confirmTransportByFormNumero", method = RequestMethod.GET)
    public ConfirmTransport getConfirmTransportByFormNumero(
            @RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter,
            @RequestParam(name = "formNumero", defaultValue = "-1" ) String formNumero) 
    {
        return confirmTransportRepository.findByFormNumero(idTransporter, formNumero);
    }
}
