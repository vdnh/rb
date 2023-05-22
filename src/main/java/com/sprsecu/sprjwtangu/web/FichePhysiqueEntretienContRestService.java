package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FichePhysiqueEntretienContRepository;
import com.sprsecu.sprjwtangu.entities.FichePhysiqueEntretienCont;
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
public class FichePhysiqueEntretienContRestService {
    @Autowired
    private FichePhysiqueEntretienContRepository fichePhysiqueEntretienContRepository;
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts", method = RequestMethod.GET)
    public List<FichePhysiqueEntretienCont> getFichePhysiqueEntretienConts(){
        return fichePhysiqueEntretienContRepository.findAll();
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts/{id}", method = RequestMethod.GET)
    public FichePhysiqueEntretienCont getFichePhysiqueEntretienCont(@PathVariable Long id){
        return fichePhysiqueEntretienContRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts", method = RequestMethod.POST)
    public FichePhysiqueEntretienCont save(@RequestBody FichePhysiqueEntretienCont c){
        return fichePhysiqueEntretienContRepository.save(c);
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fichePhysiqueEntretienContRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fichePhysiqueEntretienContRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretienConts/{id}", method = RequestMethod.PUT)
    public FichePhysiqueEntretienCont updateFichePhysiqueEntretienCont(@PathVariable Long id, @RequestBody FichePhysiqueEntretienCont c){
        c.setId(id);
        return fichePhysiqueEntretienContRepository.save(c);
    }    
    
    
    @RequestMapping(value = "/fichePhysiqueEntretienContDeCamion", method = RequestMethod.GET)
    public FichePhysiqueEntretienCont chercherFcDC(@RequestParam(name = "idCamion", defaultValue = "-1" ) Long idCamion) 
    {
        return fichePhysiqueEntretienContRepository.findByIdCamion(idCamion);
    }    
}
