package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.FileLogBookRepository;
import com.sprsecu.sprjwtangu.entities.FileLogBook;
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
public class FileLogBookRestService {
    @Autowired
    private FileLogBookRepository fileLogBookRepository;
    
    @RequestMapping(value = "/fileLogBookOfOwnerByDate", method = RequestMethod.GET)
    public List<FileLogBook> fileLogBookOfOwnerByDate(@RequestParam(name = "idOwner") Long idOwner, @RequestParam(name = "dateFindText") String dateFindText) 
    {
        return fileLogBookRepository.fileLogBookOfOwnerByDate(idOwner, dateFindText);
    }
    
    @RequestMapping(value = "/fileLogBookOfOwner", method = RequestMethod.GET)
    public List<FileLogBook> fileLogBookOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return fileLogBookRepository.fileLogBookOwner(idOwner);
    }    
    //
    @RequestMapping(value = "/chercherFileLogBookByOwner", method = RequestMethod.GET)
    public Page<FileLogBook> chercherFileLogBookByOwner(
        @RequestParam(name = "idOwner", defaultValue = "") Long idOwner, 
        @RequestParam(name = "page", defaultValue = "0")int page, 
        @RequestParam(name = "size", defaultValue = "5")int size){
        return fileLogBookRepository.chercherFileLogBookByOwner(idOwner, PageRequest.of(page, size));
    }
    //
    @RequestMapping(value = "/fileLogBook/{id}", method = RequestMethod.GET)
    public FileLogBook getFileLogBook(@PathVariable Long id){
        return fileLogBookRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/fileLogBook", method = RequestMethod.POST)
    public FileLogBook save(@RequestBody FileLogBook f){
        return fileLogBookRepository.save(f);
    }
    
    @RequestMapping(value = "/fileLogBook/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        fileLogBookRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileLogBook", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        fileLogBookRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/fileLogBook/{id}", method = RequestMethod.PUT)
    public FileLogBook updateFileLogBook(@PathVariable Long id, @RequestBody FileLogBook f){
        f.setId(id);
        return fileLogBookRepository.save(f);
    }        
}
