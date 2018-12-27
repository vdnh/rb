package com.sprsecu.sprjwtangu.web;


import com.sprsecu.sprjwtangu.dao.TransporterRepository;
import com.sprsecu.sprjwtangu.entities.Transporter;
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
public class TransporterRestService {
    @Autowired
    private TransporterRepository transporterRepository;
    
    @RequestMapping(value = "/transporters", method = RequestMethod.GET)
    public List<Transporter> getTranspoters(){
        return transporterRepository.findAll();
    }
    
    @RequestMapping(value = "/transporters/{id}", method = RequestMethod.GET)
    public Transporter getTransporter(@PathVariable Long id){
        return transporterRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/transporters", method = RequestMethod.POST)
    public Transporter save(@RequestBody Transporter t){
        return transporterRepository.save(t);
    }
    
    @RequestMapping(value = "/transporters/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        transporterRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transporters", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        transporterRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transporters/{id}", method = RequestMethod.PUT)
    public Transporter updateTransporter(@PathVariable Long id, @RequestBody Transporter t){
        t.setId(id);
        return transporterRepository.save(t);
    }    
    
    @RequestMapping(value = "/chercherTransporters", method = RequestMethod.GET)
    public Page<Transporter> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return transporterRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
    
    @RequestMapping(value = "/transporterParLogin/{loginName}", method = RequestMethod.GET)
    public Transporter transporterParLogin_name(@PathVariable String loginName)
    {
        return transporterRepository.findByLoginName(loginName);
    }
}
