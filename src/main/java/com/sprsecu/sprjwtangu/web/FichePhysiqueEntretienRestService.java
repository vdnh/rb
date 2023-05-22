package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FichePhysiqueEntretienRepository;
import com.sprsecu.sprjwtangu.entities.FichePhysiqueEntretien;
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
public class FichePhysiqueEntretienRestService {
    @Autowired
    private FichePhysiqueEntretienRepository fichePhysiqueEntretienRepository;
    
    @RequestMapping(value = "/fichePhysiqueEntretiens", method = RequestMethod.GET)
    public List<FichePhysiqueEntretien> getFichePhysiqueEntretiens(){
        return fichePhysiqueEntretienRepository.findAll();
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretiens/{id}", method = RequestMethod.GET)
    public FichePhysiqueEntretien getFichePhysiqueEntretien(@PathVariable Long id){
        return fichePhysiqueEntretienRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretiens", method = RequestMethod.POST)
    public FichePhysiqueEntretien save(@RequestBody FichePhysiqueEntretien c){
        return fichePhysiqueEntretienRepository.save(c);
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretiens/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fichePhysiqueEntretienRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretiens", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fichePhysiqueEntretienRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fichePhysiqueEntretiens/{id}", method = RequestMethod.PUT)
    public FichePhysiqueEntretien updateFichePhysiqueEntretien(@PathVariable Long id, @RequestBody FichePhysiqueEntretien c){
        c.setId(id);
        return fichePhysiqueEntretienRepository.save(c);
    }    
    
    
    @RequestMapping(value = "/fichePhysiqueEntretienDeCamion", method = RequestMethod.GET)
    public FichePhysiqueEntretien chercherFcDC(@RequestParam(name = "idCamion", defaultValue = "-1" ) Long idCamion) 
    {
        return fichePhysiqueEntretienRepository.findByIdCamion(idCamion);
    }    
}
