package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FileLicenseRepository;
import com.sprsecu.sprjwtangu.entities.FileLicense;
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
public class FileLicenseRestService {
    @Autowired
    private FileLicenseRepository fileLicenseRepository;
    
    @RequestMapping(value = "/fileLicenseOfOwner", method = RequestMethod.GET)
    public List<FileLicense> fileLicenseOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return fileLicenseRepository.fileLicenseOwner(idOwner);
    }    
    
    @RequestMapping(value = "/FileLicense/{id}", method = RequestMethod.GET)
    public FileLicense getFileLicense(@PathVariable Long id){
        return fileLicenseRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/fileLicense", method = RequestMethod.POST)
    public FileLicense save(@RequestBody FileLicense f){
        return fileLicenseRepository.save(f);
    }
    
    @RequestMapping(value = "/fileLicense/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fileLicenseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileLicense", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fileLicenseRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileLicense/{id}", method = RequestMethod.PUT)
    public FileLicense updateFileLicense(@PathVariable Long id, @RequestBody FileLicense f){
        f.setId(id);
        return fileLicenseRepository.save(f);
    }        
}
