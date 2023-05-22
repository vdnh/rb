package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ReportSellerRepository;
import com.sprsecu.sprjwtangu.entities.ReportSeller;
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
public class ReportSellerRestService {
                
    @Autowired
    private ReportSellerRepository reportSellerRepository;
    
    @RequestMapping(value = "/reportsTransporter/{idTransporter}", method = RequestMethod.GET)
    public List<ReportSeller> getReportsTransporter(@PathVariable Long idTransporter){
        return reportSellerRepository.findByIdTransporter(idTransporter);
    }
    
    // All reports of a Seller
    @RequestMapping(value = "/reportsSeller/{idSeller}", method = RequestMethod.GET)
    public List<ReportSeller> getReportsSeller(@PathVariable Long idSeller){
        return reportSellerRepository.findByIdSeller(idSeller);
    }
        
    @RequestMapping(value = "/reportSellers", method = RequestMethod.GET)
    public List<ReportSeller> getreportSellers(){
        return reportSellerRepository.findAll();
    }
        
    @RequestMapping(value = "/reportSellers/{id}", method = RequestMethod.GET)
    public ReportSeller getReportSeller(@PathVariable Long id){
        return reportSellerRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/reportSellers", method = RequestMethod.POST)
    public ReportSeller save(@RequestBody ReportSeller t){
        return reportSellerRepository.save(t);
    }
    
    @RequestMapping(value = "/reportSellers/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        reportSellerRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reportSellers", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        reportSellerRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/reportSellers/{id}", method = RequestMethod.PUT)
    public ReportSeller updateReportSeller(@PathVariable Long id, @RequestBody ReportSeller t){
        t.setId(id);
        return reportSellerRepository.save(t);
    }    

}
