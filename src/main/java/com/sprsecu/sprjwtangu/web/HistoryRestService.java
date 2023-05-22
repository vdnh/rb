package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.HistoryRepository;
import com.sprsecu.sprjwtangu.entities.History;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
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
public class HistoryRestService {
    @Autowired
    private HistoryRepository historyRepository;
    
    @RequestMapping(value = "/historyOfOwner", method = RequestMethod.GET)
    public List<History> historyOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return historyRepository.historiesOwner(idOwner);
    }    
    
    @RequestMapping(value = "/history/{id}", method = RequestMethod.GET)
    public History getHistory(@PathVariable Long id){
        return historyRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/history", method = RequestMethod.POST)
    public History save(@RequestBody History h){
        return historyRepository.save(h);
    }
    
    @RequestMapping(value = "/history/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        historyRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/history", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        historyRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/history/{id}", method = RequestMethod.PUT)
    public History updateHistory(@PathVariable Long id, @RequestBody History h){
        h.setId(id);
        return historyRepository.save(h);
    }        
}
