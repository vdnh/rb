package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FileInspectRepository;
import com.sprsecu.sprjwtangu.entities.FileInspect;
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
public class FileInspectRestService {
    @Autowired
    private FileInspectRepository fileInspectRepository;
    
    @RequestMapping(value = "/fileInspectOfOwner", method = RequestMethod.GET)
    public List<FileInspect> fileInspectOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return fileInspectRepository.fileInspectOwner(idOwner);
    }    
    
    @RequestMapping(value = "/FileInspect/{id}", method = RequestMethod.GET)
    public FileInspect getFileInspect(@PathVariable Long id){
        return fileInspectRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/fileInspect", method = RequestMethod.POST)
    public FileInspect save(@RequestBody FileInspect f){
        return fileInspectRepository.save(f);
    }
    
    @RequestMapping(value = "/fileInspect/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fileInspectRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileInspect", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fileInspectRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileInspect/{id}", method = RequestMethod.PUT)
    public FileInspect updateFileInspect(@PathVariable Long id, @RequestBody FileInspect f){
        f.setId(id);
        return fileInspectRepository.save(f);
    }        
}
