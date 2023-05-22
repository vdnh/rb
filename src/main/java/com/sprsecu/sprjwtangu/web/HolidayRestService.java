package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.HolidayRepository;
import com.sprsecu.sprjwtangu.entities.Holiday;
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
 * © Nhat Hung VO DINH
 */
@RestController
@CrossOrigin("*")
public class HolidayRestService {
    @Autowired
    private HolidayRepository holidayRepository;
    
    @RequestMapping(value = "/holidayOfOwner", method = RequestMethod.GET)
    public List<Holiday> holidayOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return holidayRepository.holidaysOwner(idOwner);
    }    
    
    @RequestMapping(value = "/holiday/{id}", method = RequestMethod.GET)
    public Holiday getHoliday(@PathVariable Long id){
        return holidayRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/holiday", method = RequestMethod.POST)
    public Holiday save(@RequestBody Holiday h){
        return holidayRepository.save(h);
    }
    
    @RequestMapping(value = "/holiday/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        holidayRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/holiday", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        holidayRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/holiday/{id}", method = RequestMethod.PUT)
    public Holiday updateHoliday(@PathVariable Long id, @RequestBody Holiday h){
        h.setId(id);
        return holidayRepository.save(h);
    }        
}
