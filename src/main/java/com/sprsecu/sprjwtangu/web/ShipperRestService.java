package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ShipperRepository;
import com.sprsecu.sprjwtangu.entities.Shipper;
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
public class ShipperRestService {

    @Autowired
     ShipperRepository shipperRepository;
    
    @RequestMapping(value = "/shippers", method = RequestMethod.GET)
    public List<Shipper> getShippers(){
        return shipperRepository.findAll();
    }
    
    @RequestMapping(value = "/shippersTransporter/{id}", method = RequestMethod.GET)
    public List<Shipper> getShippersTransporter(@PathVariable Long id){
        return shipperRepository.findByIdTransporter(id);
    }
    
    @RequestMapping(value = "/shippers/{id}", method = RequestMethod.GET)
    public Shipper getShipper(@PathVariable Long id){
        return shipperRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/shippers", method = RequestMethod.POST)
    public Shipper save(@RequestBody Shipper t){
        return shipperRepository.save(t);
    }
    
    @RequestMapping(value = "/shippers/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        shipperRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/shippers", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        shipperRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/shippers/{id}", method = RequestMethod.PUT)
    public Shipper updateShipper(@PathVariable Long id, @RequestBody Shipper s){
        s.setId(id);
        return shipperRepository.save(s);
    }    
    
    @RequestMapping(value = "/chercherShippers", method = RequestMethod.GET)
    public Page<Shipper> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return shipperRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
    
    @RequestMapping(value = "/chercherShippersByIdTransporter", method = RequestMethod.GET)
    public Page<Shipper> chercherByIdTransporter(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "id", defaultValue = "") Long id, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return shipperRepository.chercherByIdTransporter("%"+mc+"%", id, PageRequest.of(page, size));
    }
    
    //*
    @RequestMapping(value = "/shipperParLogin/{loginName}", method = RequestMethod.GET)
    public Shipper shipperParLogin_name(@PathVariable String loginName)
    {
        return shipperRepository.findByLoginName(loginName);
    }//*/
    
    @RequestMapping(value = "/shipperSignUp", method = RequestMethod.POST)
    public Shipper saveSignUp(@RequestBody Shipper t){
        return shipperRepository.save(t);
    }
}
