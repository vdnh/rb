package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.DriverLicenseRepository;
import com.sprsecu.sprjwtangu.entities.DriverLicense;
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
public class DriverLicenseRestService {
    @Autowired
    private DriverLicenseRepository driverLicenseRepository;
    
    @RequestMapping(value = "/driverLicenseOfOwner", method = RequestMethod.GET)
    public List<DriverLicense> driverLicenseOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return driverLicenseRepository.driverLicensesOwner(idOwner);
    }    
    
    @RequestMapping(value = "/driverLicense/{id}", method = RequestMethod.GET)
    public DriverLicense getDriverLicense(@PathVariable Long id){
        return driverLicenseRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/driverLicense", method = RequestMethod.POST)
    public DriverLicense save(@RequestBody DriverLicense d){
        return driverLicenseRepository.save(d);
    }
    
    @RequestMapping(value = "/driverLicense/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        driverLicenseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/driverLicense", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        driverLicenseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/driverLicense/{id}", method = RequestMethod.PUT)
    public DriverLicense updateDriverLicense(@PathVariable Long id, @RequestBody DriverLicense d){
        d.setId(id);
        return driverLicenseRepository.save(d);
    }
}
