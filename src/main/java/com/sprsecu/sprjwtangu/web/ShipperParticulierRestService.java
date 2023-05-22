package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ShipperParticulierRepository;
import com.sprsecu.sprjwtangu.entities.ShipperParticulier;
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
public class ShipperParticulierRestService {

    @Autowired
     ShipperParticulierRepository shipperParticulierRepository;
    
    @RequestMapping(value = "/shipperParticuliers", method = RequestMethod.GET)
    public List<ShipperParticulier> getShipperParticuliers(){
        return shipperParticulierRepository.findAll();
    }
    
    @RequestMapping(value = "/shipperParticuliers/{id}", method = RequestMethod.GET)
    public ShipperParticulier getShipperParticulier(@PathVariable Long id){
        return shipperParticulierRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/shipperParticuliersByIdTransporter/{idTransporter}", method = RequestMethod.GET)
    public ShipperParticulier getShipperParticulierByIdTransporter(@PathVariable Long idTransporter){
        return shipperParticulierRepository.findByIdTransporter(idTransporter);
    }
    
    @RequestMapping(value = "/shipperParticuliers", method = RequestMethod.POST)
    public ShipperParticulier save(@RequestBody ShipperParticulier t){
        return shipperParticulierRepository.save(t);
    }
    
    @RequestMapping(value = "/shipperParticuliers/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        shipperParticulierRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/shipperParticuliers", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        shipperParticulierRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/shipperParticuliers/{id}", method = RequestMethod.PUT)
    public ShipperParticulier updateShipper(@PathVariable Long id, @RequestBody ShipperParticulier s){
        s.setId(id);
        return shipperParticulierRepository.save(s);
    }    
    
    @RequestMapping(value = "/chercherShipperParticuliers", method = RequestMethod.GET)
    public Page<ShipperParticulier> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return shipperParticulierRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }
    //*
    @RequestMapping(value = "/shipperParticulierParLogin/{loginName}", method = RequestMethod.GET)
    public ShipperParticulier shipperParticulierParLogin_name(@PathVariable String loginName)
    {
        return shipperParticulierRepository.findByLoginName(loginName);
    }//*/
    
    @RequestMapping(value = "/shipperParticulierSignUp", method = RequestMethod.POST)
    public ShipperParticulier saveSignUp(@RequestBody ShipperParticulier t){
        return shipperParticulierRepository.save(t);
    }
}
