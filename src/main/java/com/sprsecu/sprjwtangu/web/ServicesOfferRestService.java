package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ServicesOfferRepository;
import com.sprsecu.sprjwtangu.entities.ServicesOffer;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author vdnh
 */
public class ServicesOfferRestService {
    @Autowired
    private ServicesOfferRepository servicesOfferRepository;
    
    @RequestMapping(value = "/servicesOffers", method = RequestMethod.GET)
    public List<ServicesOffer> getServicesOffers(){
        return servicesOfferRepository.findAll();
    }
    
    @RequestMapping(value = "/servicesOffers/{id}", method = RequestMethod.GET)
    public ServicesOffer getServicesOffer(@PathVariable Long id){
        return servicesOfferRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/servicesOffers", method = RequestMethod.POST)
    public ServicesOffer save(@RequestBody ServicesOffer s){
        return servicesOfferRepository.save(s);
    }
@RequestMapping(value = "/servicesOffers/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        servicesOfferRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/servicesOffers", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        servicesOfferRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/servicesOffers/{id}", method = RequestMethod.PUT)
    public ServicesOffer updateServicesOffer(@PathVariable Long id, @RequestBody ServicesOffer s){
        s.setId(id);
        return servicesOfferRepository.save(s);
    }
    
    @RequestMapping(value = "/servicesOfferDeTransporter", method = RequestMethod.GET)
    public ServicesOffer chercherSDT(@RequestParam(name = "id_transporter", defaultValue = "-1" ) Long id_transporter) 
    {
        return servicesOfferRepository.servicesOfferDeTransporter(id_transporter);
    }    
}
