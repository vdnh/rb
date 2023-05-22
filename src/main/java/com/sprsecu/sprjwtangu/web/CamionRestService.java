package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.dto.CamionForRoute;
import com.sprsecu.sprjwtangu.entities.Camion;
import java.io.Serializable;
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
public class CamionRestService {
    
    @Autowired
    private CamionRepository camionRepository;
    
    @RequestMapping(value = "/camions", method = RequestMethod.GET)
    public List<Camion> getCamions(){
        return camionRepository.findAll();
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.GET)
    public Camion getCamion(@PathVariable Long id){
        return camionRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/camions", method = RequestMethod.POST)
    public Camion save(@RequestBody Camion c){
        return camionRepository.save(c);
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        camionRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camions", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        camionRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/camions/{id}", method = RequestMethod.PUT)
    public Camion updateCamion(@PathVariable Long id, @RequestBody Camion c){
        c.setId(id);
        return camionRepository.save(c);
    }    
    
//    @RequestMapping(value = "/camionUpdateFromTerminal/{id}", method = RequestMethod.PUT)
//    @RequestMapping(value = "/camionUpdateFromTerminal", method = RequestMethod.PATCH)
    @RequestMapping(value = "/camionUpdateFromTerminal", method = RequestMethod.POST)
    public CamionForRoute updateCamionFromTerminal(@RequestBody CamionForRoute cFR) // cFR : camion for route
    {
        
        System.out.println("I'm in camionUpdateFromTerminal : "+cFR.getId());
        Camion c = camionRepository.getOne(cFR.getId());
        System.out.println("I got Camion : "+c.getId());
        cFR.transferData(c); // transfer data from DTO CamionForRoute to DAO Camion
        try{
            camionRepository.save(c);
            System.out.println("Saved light truck");
            return cFR;
        }
        catch(Exception e){
            System.out.println("Can't save light truck");
            System.out.println(e.toString());
            return null;
        }
    }
    
    @RequestMapping(value = "/chercherPlaque", method = RequestMethod.GET)
    public Page<Camion> chercherPlaque(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return camionRepository.chercherPlaque("%"+mc+"%", PageRequest.of(page, size));
    }    
    
    @RequestMapping(value = "/camionsDeTransporterPaged", method = RequestMethod.GET)
    public Page<Camion> camionsDeTransporterPaged(
        @RequestParam(name = "idTransporter", defaultValue = "") Long idTransporter,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "5") int size)
    {
        return camionRepository.camionsDeTransporterPaged(idTransporter, PageRequest.of(page, size));
    }
    
    @RequestMapping(value = "/camionsDeTransporter", method = RequestMethod.GET)
    public List<Camion> chercherCDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return camionRepository.camionsDeTransporter(idTransporter);
    }
    
    @RequestMapping(value = "/camionMonitoring", method = RequestMethod.GET)
    public Camion chercherCM(
            @RequestParam(name = "uniteMonitor", defaultValue = "-1" ) String uniteMonitor,
            @RequestParam(name = "monitor", defaultValue = "-1" ) String monitor) 
    {
        return camionRepository.camionMonitoring(uniteMonitor, monitor);
    }
}

//class CamionForRoute  implements Serializable{
//    public Long id;
//    public Long odometre;     
//    public Double longtitude;
//    public Double latitude;
//    public Double direction; // 0.00 - 359.99 -- north-east-south-west;    
//    public Double speed;
//    public Long timeStop; // the time when terminal stopped;  new Date().getTime()
//    public String location; // address in AVL
//    
//    public CamionForRoute(Camion c){
//        this.id=c.getId();
//        this.odometre=c.getOdometre();     
//        this.longtitude=c.getLongtitude();
//        this.latitude=c.getLatitude();
//        this.direction=c.getDirection();  
//        this.speed=c.getSpeed();
//        this.timeStop=c.getTimeStop();
//        this.location=c.getLocation();
//    }
//    
//    public void transferData(Camion c){
//        c.setOdometre(this.odometre);     
//        c.setLatitude(this.latitude);
//        c.setLongtitude(this.longtitude);
//        c.setSpeed(this.speed);
//        c.setDirection(this.direction);
//        c.setTimeStop(this.timeStop);
//        c.setLocation(this.location);
//    }
//}