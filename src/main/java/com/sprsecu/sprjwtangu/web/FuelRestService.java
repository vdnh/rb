package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FuelRepository;
import com.sprsecu.sprjwtangu.entities.Fuel;
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
 * © Nhat Hung VO DINH
 */
@RestController
@CrossOrigin("*")
public class FuelRestService {
    @Autowired
    private FuelRepository fuelRepository;

    @RequestMapping(value = "/fuelOfOwner", method = RequestMethod.GET)
    public List<Fuel> fuelOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return fuelRepository.fuelsOwner(idOwner);
    }    

    @RequestMapping(value = "/fuel/{id}", method = RequestMethod.GET)
    public Fuel getFuel(@PathVariable Long id){
        return fuelRepository.findById(id).get();
    }

    @RequestMapping(value = "/fuel", method = RequestMethod.POST)
    public Fuel save(@RequestBody Fuel f){
        return fuelRepository.save(f);
    }

    @RequestMapping(value = "/fuel/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fuelRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/fuel", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fuelRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/fuel/{id}", method = RequestMethod.PUT)
    public Fuel updateFuel(@PathVariable Long id, @RequestBody Fuel f){
        f.setId(id);
        return fuelRepository.save(f);
    }        
}