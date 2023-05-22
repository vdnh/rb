/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.RepereRepository;
import com.sprsecu.sprjwtangu.entities.Repere;
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
public class RepereRestService {
    @Autowired
    private RepereRepository repereRepository;
    
    // All Reperes of un transporter
    @RequestMapping(value = "/reperesTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Repere> getReperesTransporter(@PathVariable Long idTransporter){
        return repereRepository.findByIdTransporter(idTransporter);
    }
    
    
    @RequestMapping(value = "/reperes", method = RequestMethod.GET)
    public List<Repere> getItineraires(){
        return repereRepository.findAll();
    }
    
    @RequestMapping(value = "/reperesEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<Repere> getReperesEntreprise(@PathVariable Long idEntreprise){
        return repereRepository.findByIdEntreprise(idEntreprise);
    }
    
    @RequestMapping(value = "/reperes/{id}", method = RequestMethod.GET)
    public Repere getRepere(@PathVariable Long id){
        return repereRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/reperes", method = RequestMethod.POST)
    public Repere save(@RequestBody Repere r){
        return repereRepository.save(r);
    }
    
    @RequestMapping(value = "/reperes/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        repereRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reperes", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        repereRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reperes/{id}", method = RequestMethod.PUT)
    public Repere updateRepere(@PathVariable Long id, @RequestBody Repere r){
        r.setId(id);
        return repereRepository.save(r);
    }
}
