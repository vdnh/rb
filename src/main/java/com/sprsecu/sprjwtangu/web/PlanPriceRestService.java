package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.PlanPriceRepository;
import com.sprsecu.sprjwtangu.entities.PlanPrice;
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
public class PlanPriceRestService {
    @Autowired
    private PlanPriceRepository planPriceRepository;
    
    @RequestMapping(value = "/planPrices", method = RequestMethod.GET)
    public List<PlanPrice> getPlanPrices(){
        return planPriceRepository.findAll();
    }
    
    @RequestMapping(value = "/planPrices/{id}", method = RequestMethod.GET)
    public PlanPrice getPlanPrice(@PathVariable Long id){
        return planPriceRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/planPrices", method = RequestMethod.POST)
    public PlanPrice save(@RequestBody PlanPrice p){
        return planPriceRepository.save(p);
    }
    
}
