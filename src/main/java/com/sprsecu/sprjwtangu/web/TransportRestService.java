package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.LoadDetailRepository;
import com.sprsecu.sprjwtangu.dao.TransportModelRepository;
import com.sprsecu.sprjwtangu.dao.TransportRepository;
import com.sprsecu.sprjwtangu.entities.LoadDetail;
import com.sprsecu.sprjwtangu.entities.Transport;
import com.sprsecu.sprjwtangu.entities.TransportModel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
public class TransportRestService {
            
    @Autowired
    private TransportRepository transportRepository;
    @Autowired
    private TransportModelRepository transportModelRepository;
    @Autowired
    private LoadDetailRepository loadDetailRepository;
    //* functions for TransportModel
    @RequestMapping(value = "/transportModels", method = RequestMethod.GET)
    public List<TransportModel> getTransportModels(){
        return transportModelRepository.findAll();
    }
    
    // All transports of un entreprise
    @RequestMapping(value = "/transportModelsEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<TransportModel> getTransportModelsEntreprise(@PathVariable Long idEntreprise){
        return transportModelRepository.findByIdEntreprise(idEntreprise);
    }
    
    // All transports of un transporter
    @RequestMapping(value = "/transportsTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Transport> getTransportsTransporter(@PathVariable Long idTransporter){
        return transportRepository.findByIdTransporter(idTransporter);
    }
//    Page<Transport> for commands
    @RequestMapping(value = "/commandsTransportTransporterPaged", method = RequestMethod.GET)
    public Page<Transport> getCommandsTransportTransporterPaged(
        @RequestParam(name = "idTransporter", defaultValue = "0") Long idTransporter,
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        System.out.println("Done commandsTransportTransporterPaged");
        return transportRepository.commandsOfTransporterPaged(idTransporter,PageRequest.of(page, size));
    }
    // All commands transport of un transporter
    @RequestMapping(value = "/commandsTransportTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Transport> getCommandsTransportTransporter(@PathVariable Long idTransporter){
//        List<Transport> resultAll=transportRepository.findByIdTransporter(idTransporter);
        List<Transport> result= new ArrayList<>();
        
        transportRepository.findByIdTransporter(idTransporter).forEach(u -> {
//            System.out.println("idtransport : "+u.getId());
            if(u.getValid() && u.getTypeDoc()!=null && u.getTypeDoc()==2){
                result.add(u);
            }
        });
//        for(Transport transport: resultAll){
//            System.out.println("We are in for of Commands");
//            if(transport.getValid() && transport.getTypeDoc()==2){
//                System.out.println("We found a command");
//                result.add(transport);
//            }
//        }
//        System.out.println("Commands number : " + result.size());
        return result;
    }
    
    // All evaluations transport of un transporter
    @RequestMapping(value = "/evaluationsTransportTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<Transport> getEvaluationsTransportTransporter(@PathVariable Long idTransporter){
//        List<Transport> resultAll=transportRepository.findByIdTransporter(idTransporter);
        List<Transport> result= new ArrayList<>();
        transportRepository.findByIdTransporter(idTransporter).forEach(u -> {
//            System.out.println("idtransport : "+u.getId());
            if(u.getValid() && u.getTypeDoc()!=null && u.getTypeDoc()==1){
                result.add(u);
            }
        });
//        for(Transport transport: resultAll){
//            System.out.println("We are in for of Evaluation");
//            if(transport.getValid() && transport.getTypeDoc()==1){
//                System.out.println("We found an evaluation");
//                result.add(transport);
//            }
//        }
//        System.out.println("Evaluations number : " + result.size());
        return result;
    }
    @RequestMapping(value = "/transportModels", method = RequestMethod.POST)
    public TransportModel save(@RequestBody TransportModel t){
        return transportModelRepository.save(t);
    }
    
    @RequestMapping(value = "/transportModels/{id}", method = RequestMethod.DELETE)
    public boolean supprimerTransportModel(@PathVariable Long id){
        transportModelRepository.deleteById(id);
        return true;
    }
    // end of functions for TransportModel*/
    
    @RequestMapping(value = "/transports", method = RequestMethod.GET)
    public List<Transport> getTransports(){
        return transportRepository.findAll();
    }
    
    @RequestMapping(value = "/transportsEntreprise/{idEntreprise}", method = RequestMethod.GET)
    public List<Transport> getTransportsEntreprise(@PathVariable Long idEntreprise){
        return transportRepository.findByIdEntreprise(idEntreprise);
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.GET)
    public Transport getTransport(@PathVariable Long id){
        return transportRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/transports", method = RequestMethod.POST)
    public Transport save(@RequestBody Transport t){
        return transportRepository.save(t);
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        transportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transports", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        transportRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/transports/{id}", method = RequestMethod.PUT)
    public Transport updateTransport(@PathVariable Long id, @RequestBody Transport t){
        t.setId(id);
        return transportRepository.save(t);
    }    
    
    @RequestMapping(value = "/chercherTransports", method = RequestMethod.GET)
    public Page<Transport> chercher(
        @RequestParam(name = "mc", defaultValue = "") String mc, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return transportRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }

    // Delete All evaluations longer 1 months transport of un transporter 
    @RequestMapping(value = "/cleanEvaluationsTransportTransporter/{idTransporter}", method = RequestMethod.GET)
    public void getCleanEvaluationsTransportTransporter(@PathVariable Long idTransporter){
        // the first get all evaluations of this transporter longer than 1 month
        long timeNow =  new Date().getTime(); // time now in ms
        long msOf30Days = (1000l * 60l * 60l * 24l * 30l); // ms of 30 days
        System.out.println("timeNow: "+ timeNow);
        System.out.println("msOf30Days: "+ msOf30Days);                
//        List<Transport> evaluationsToDelete= new ArrayList<>();
//        List<LoadDetail> loadDetails= new ArrayList<>();
        System.out.println("Enter in the Evaluations list");
        transportRepository.findByIdTransporter(idTransporter).forEach(t -> {
        // 
            if(t.getTypeDoc()!=null && t.getTypeDoc()==1 && 
               (timeNow - ((Date)t.getDateDepart()).getTime()>msOf30Days)){
                // evaluationsToDelete.add(u);
                System.out.println("");
                loadDetailRepository.findByIdTransport(t.getId()).forEach(l->{
                    loadDetailRepository.delete(l);
                    System.out.println("Delete loadDetail: "+ l.getId());
                });
                transportRepository.delete(t);
                System.out.println("Delete transport: "+ t.getId());
            }
        });
        System.out.println("End of Evaluations list");
    }
    
    //    Page<Transport> for evaluations
    @RequestMapping(value = "/evaluationsTransportTransporterPaged", method = RequestMethod.GET)
    public Page<Transport> getEvaluationsTransportTransporterPaged(
        @RequestParam(name = "idTransporter", defaultValue = "0") Long idTransporter,
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        System.out.println("Done evaluatiosOfTransporterPaged");
        return transportRepository.evaluatiosOfTransporterPaged(idTransporter,PageRequest.of(page, size));
    }
}
