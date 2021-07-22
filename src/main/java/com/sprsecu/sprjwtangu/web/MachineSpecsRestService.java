package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.entities.MachineSpecs;
import com.sprsecu.sprjwtangu.entities.MachineSpecsRepository;
import java.util.Map;
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

public class MachineSpecsRestService {
    @Autowired
    private MachineSpecsRepository machineSpecsRepository;
    
    // All Machines light data (id and name)
    @RequestMapping(value = "/allLightMachines", method = RequestMethod.GET)
    public Map<Long, String> getAllLightMachines(){
        return machineSpecsRepository.getAllLightMachines();
    }
    @RequestMapping(value = "/machines/{id}", method = RequestMethod.GET)
    public MachineSpecs findById(@PathVariable Long id){
        return machineSpecsRepository.findById(id).get();
    }
    @RequestMapping(value = "/machines", method = RequestMethod.POST)
    public MachineSpecs save(@RequestBody MachineSpecs l){
        return machineSpecsRepository.save(l);
    }
    
    @RequestMapping(value = "/machines/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        machineSpecsRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/machines", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        machineSpecsRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/machines/{id}", method = RequestMethod.PUT)
    public MachineSpecs updateMachine(@PathVariable Long id, @RequestBody MachineSpecs l){
        l.setId(id);
        return machineSpecsRepository.save(l);
    }

}
