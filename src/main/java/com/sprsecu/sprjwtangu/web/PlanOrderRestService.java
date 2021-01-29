package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.PlanOrderRepository;
import com.sprsecu.sprjwtangu.entities.PlanOrder;
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
public class PlanOrderRestService {
    @Autowired
    private PlanOrderRepository planOrderRepository;
    
    @RequestMapping(value = "/planOrders", method = RequestMethod.GET)
    public List<PlanOrder> getPlanOrders(){
        return planOrderRepository.findAll();
    }
    
    @RequestMapping(value = "/planOrders/{id}", method = RequestMethod.GET)
    public PlanOrder getPlanOrder(@PathVariable Long id){
        return planOrderRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/planOrders", method = RequestMethod.POST)
    public PlanOrder save(@RequestBody PlanOrder p){
        return planOrderRepository.save(p);
    }
    
    @RequestMapping(value = "/planOrders/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        planOrderRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/planOrders", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        planOrderRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/planOrders/{id}", method = RequestMethod.PUT)
    public PlanOrder updatePlanOrder(@PathVariable Long id, @RequestBody PlanOrder p){
        p.setId(id);
        return planOrderRepository.save(p);
    }

    @RequestMapping(value = "/planOrdersDeTransporter", method = RequestMethod.GET)
    public List<PlanOrder> chercherPDT(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter) 
    {
        return planOrderRepository.findByIdTransporter(idTransporter);
    }
}
