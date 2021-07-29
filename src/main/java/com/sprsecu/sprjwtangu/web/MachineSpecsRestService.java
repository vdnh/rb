package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.entities.MachineSpecs;
import com.sprsecu.sprjwtangu.entities.MachineSpecsRepository;
import java.util.HashMap;
import java.util.List;
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
    public Map<Long, String> getAllLightMachines(@RequestParam(name = "idTransporter", defaultValue = "-1" ) Long idTransporter){
        Map<Long, String> results = new HashMap<Long, String>();

//   EntityManager em = entityManagerFactory.createEntityManager();

   // Construct and run query
   
   List<Object[]> resultList = machineSpecsRepository.getAllLightMachines(idTransporter);

   // Place results in map
   for (Object[] borderTypes: resultList) {
      results.put((Long)borderTypes[0], (String)borderTypes[1]);
   }

   return results;
//        return machineSpecsRepository.getAllLightMachines();
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
