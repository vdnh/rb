package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.TerminalRepository;
import com.sprsecu.sprjwtangu.entities.Terminal;
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
public class TerminalRestService {
    @Autowired
    private TerminalRepository terminalRepository;
    
    @RequestMapping(value = "/terminals", method = RequestMethod.GET)
    public List<Terminal> getTerminals(){
        return terminalRepository.findAll();
    }
    
    @RequestMapping(value = "/terminals/{id}", method = RequestMethod.GET)
    public Terminal getTerminal(@PathVariable Long id){
        return terminalRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/terminals", method = RequestMethod.POST)
    public Terminal save(@RequestBody Terminal t){
        // set the field accepts of terminal to 'savingfromterminal', then save the infos have just been changed
        if(t.getTempora()!=null && t.getTempora().length()>0 && t.getTempora().compareToIgnoreCase("savingfromterminal")==0){
            System.out.println("We are in: savingfromterminal");
            Terminal temp = terminalRepository.getOne(t.getId());
            System.out.println("Then, We got the infos origin of terminal");
            temp.setDirection(t.getDirection());
            temp.setLatitude(t.getLatitude());
            temp.setLongitude(t.getLongitude());
            temp.setSpeed(t.getSpeed());
            temp.setStopDuration(t.getStopDuration());
            temp.setTimeStop(t.getTimeStop());
            System.out.println("Then, We finish update the infos changed");
            return terminalRepository.save(temp);
        }
        
        System.out.println("Saving Terminal from Dispatch.");
        return terminalRepository.save(t);
    }
    
    @RequestMapping(value = "/terminals/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        terminalRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/terminals", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        terminalRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/terminals/{id}", method = RequestMethod.PUT)
    public Terminal updateTerminal(@PathVariable Long id, @RequestBody Terminal t){
        t.setId(id);
        return terminalRepository.save(t);
    }    
    
    
    @RequestMapping(value = "/terminalsDeTransporter", method = RequestMethod.GET)
    public List<Terminal> chercherTDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return terminalRepository.terminalsDeTransporter(idTransporter);
    }
    
}
