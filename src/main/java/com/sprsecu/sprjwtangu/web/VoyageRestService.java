package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.VoyageRepository;
import com.sprsecu.sprjwtangu.entities.Voyage;
import java.util.ArrayList;
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
public class VoyageRestService {
    @Autowired
    private VoyageRepository voyageRepository;
    
    @RequestMapping(value = "/voyages", method = RequestMethod.GET)
    public List<Voyage> getVoyages(){
        return voyageRepository.findAll();
    }
    
    @RequestMapping(value = "/voyages/{id}", method = RequestMethod.GET)
    public Voyage getVoyage(@PathVariable Long id){
        return voyageRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/voyages", method = RequestMethod.POST)
    public Voyage save(@RequestBody Voyage v){
        return voyageRepository.save(v);
    }
    
    @RequestMapping(value = "/voyages/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        voyageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/voyages", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        voyageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/voyages/{id}", method = RequestMethod.PUT)
    public Voyage updateVoyage(@PathVariable Long id, @RequestBody Voyage v){
        v.setId(id);
        return voyageRepository.save(v);
    }    
        
    @RequestMapping(value = "/voyagesDeTransporter", method = RequestMethod.GET)
    public List<Voyage> chercherVdT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return voyageRepository.voyagesDeTransporter(idTransporter);
    }
        
    @RequestMapping(value = "/chercherVoyages", method = RequestMethod.GET)
    public Page<Voyage> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "id", defaultValue = " ") String id, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return voyageRepository.chercher("%"+mc+"%", id, PageRequest.of(page, size));
    }
    
    @RequestMapping(value = "/matchingVoyages", method = RequestMethod.GET)
    public List<Voyage> matching(
            @RequestParam(name = "typeCamion", defaultValue = "" ) String typeCamion
            , @RequestParam(name = "optionVoyage", defaultValue = "" ) String optionVoyage
            //, @RequestParam(name = "dateDepart", defaultValue = "3000-01-01" ) String dateDepart
        ){
        return voyageRepository.matching("%"+typeCamion+"%", "%"+optionVoyage+"%"); //, dateDepart);
    }
    
    @RequestMapping(value = "/matchedVoyages", method = RequestMethod.GET)
    public List<Voyage> matchedVoyages(@RequestParam(name = "mv", defaultValue = "" ) String mv)
    {
        List<Voyage> voys= new ArrayList<>();
        String[] listIdVoys = mv.split(",");
        for(String id : listIdVoys){
            voys.add(voyageRepository.getOne(new Long(id)));
        }
        System.out.println("list Ids Voyages : " + listIdVoys.toString());
        
        return voys;
        //return voyageRepository.matchedVoyages(mv); //, dateDepart);
    }
/*/
    @Query("select v from Voyage v where v.id in (:mv)")
    public List<Voyage> matchedVoyages(
            @Param("mv") String typeCamion
            );
    
    @RequestMapping(value = "/chercherClients", method = RequestMethod.GET)
    public List<BankClient> chercher(@RequestParam(name = "mc", defaultValue = "") String mc)
    {
        //return shipperRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
        return bankClientRepository.chercher("%"+mc+"%");
    }
//*/
}
