package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.AutreEntretienRepository;
import com.sprsecu.sprjwtangu.entities.AutreEntretien;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
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
public class AutreEntretienRestService {
    @Autowired
    private AutreEntretienRepository autreEntretienRepository;
    
    @RequestMapping(value = "/autreEntretiens", method = RequestMethod.GET)
    public List<AutreEntretien> getAutreEntretiens(){
        return autreEntretienRepository.findAll();
    }
    
    @RequestMapping(value = "/autreEntretiens/{id}", method = RequestMethod.GET)
    public AutreEntretien getAutreEntretien(@PathVariable Long id){
        return autreEntretienRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/autreEntretiens", method = RequestMethod.POST)
    public AutreEntretien save(@RequestBody AutreEntretien c){
        return autreEntretienRepository.save(c);
    }
    
    @RequestMapping(value = "/autreEntretiens/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        autreEntretienRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/autreEntretiens", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        autreEntretienRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/autreEntretiens/{id}", method = RequestMethod.PUT)
    public AutreEntretien updateAutreEntretien(@PathVariable Long id, @RequestBody AutreEntretien c){
        c.setId(id);
        return autreEntretienRepository.save(c);
    }    
    
    
    @RequestMapping(value = "/autreEntretienDeCamion", method = RequestMethod.GET)
    public List<AutreEntretien> chercherFcDC(@RequestParam(name = "idCamion", defaultValue = "-1" ) Long idCamion) 
    {
        TimeZone currentTimeZone = TimeZone.getDefault();
        Date d = new Date();
        long offsetInMilliseconds= currentTimeZone.getOffset(d.getTime());
        List<AutreEntretien> tempEntres = autreEntretienRepository.findByIdCamion(idCamion);
        tempEntres.forEach(ent->{
            if(ent.getDateFait()!=null){
                if(ent.getDateFaitMiliseconds()!=null){
                    ent.setDateFait(new Date(ent.getDateFaitMiliseconds()));
                }
                else{
                    Date tempDate = ent.getDateFait();
                    long tempTime = tempDate.getTime() + offsetInMilliseconds;
                    ent.setDateFait(new Date(tempTime));
                }
            }
        });
        return tempEntres;
//        return autreEntretienRepository.findByIdCamion(idCamion);
    }    
}