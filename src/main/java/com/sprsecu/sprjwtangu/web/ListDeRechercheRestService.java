package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ListDeRechercheRepository;
import com.sprsecu.sprjwtangu.entities.ListDeRecherche;
import java.util.List;
import javax.websocket.server.PathParam;
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
public class ListDeRechercheRestService {
    
    @Autowired
    private ListDeRechercheRepository listDeRechercheRepository;
    
    @RequestMapping(value = "/listDeRecherches", method = RequestMethod.GET)
    public List<ListDeRecherche> getListDeRecherches(){
        return listDeRechercheRepository.findAll();
    }
    
    @RequestMapping(value = "/listDeRecherches/{id}", method = RequestMethod.GET)
    public ListDeRecherche getCamion(@PathVariable Long id){
        return listDeRechercheRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/listDeRecherches", method = RequestMethod.POST)
    public ListDeRecherche save(@RequestBody ListDeRecherche l){
        return listDeRechercheRepository.save(l);
    }
    
    @RequestMapping(value = "/listDeRecherches/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        listDeRechercheRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/listDeRecherches", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        listDeRechercheRepository.deleteById(id);
        return true;
    }
    
    
    @RequestMapping(value = "/listDeRecherches/{id}", method = RequestMethod.PUT)
    public ListDeRecherche updateListDeRecherche(@PathVariable Long id, @RequestBody ListDeRecherche l){
        l.setId(id);
        return listDeRechercheRepository.save(l);
    }
}
