package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.MessageRepository;
import com.sprsecu.sprjwtangu.entities.Message;
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
public class MessageRestService {
    @Autowired
    private MessageRepository messageRepository;
    
    @RequestMapping(value = "/messages", method = RequestMethod.GET)
    public List<Message> getMessages(){
        return messageRepository.findAll();
    }
    
    @RequestMapping(value = "/messages/{id}", method = RequestMethod.GET)
    public Message getMessage(@PathVariable Long id){
        return messageRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/messages", method = RequestMethod.POST)
    public Message save(@RequestBody Message m){
        return messageRepository.save(m);
    }
    
    @RequestMapping(value = "/messages/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        messageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/messages", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        messageRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/messages/{id}", method = RequestMethod.PUT)
    public Message updateMessage(@PathVariable Long id, @RequestBody Message m){
        m.setId(id);
        return messageRepository.save(m);
    }    
    
    @RequestMapping(value = "/messagesReceived", method = RequestMethod.GET)
    public List<Message> messagesReceived(@RequestParam(name = "idReceiver", defaultValue = "-1" ) Long idReceiver) 
    {
        return messageRepository.messagesReceived(idReceiver);
    }
    
    
    @RequestMapping(value = "/messagesSent", method = RequestMethod.GET)
    public List<Message> messagesSent(@RequestParam(name = "idSender", defaultValue = "-1" ) Long idSender) 
    {
        return messageRepository.messagesSent(idSender);
    }
    
    @RequestMapping(value = "/messageDemandeContacted", method = RequestMethod.GET)
    public Message messageDemandeContacted(
            @RequestParam(name = "idSender", defaultValue = "-1" ) Long idSender,
            @RequestParam(name = "idDemande", defaultValue = "-1" ) Long idDemande
        ) 
    {
        return messageRepository.messageDemandeContacted(idSender, idDemande);
    }
    
    @RequestMapping(value = "/messageVoyageContacted", method = RequestMethod.GET)
    public Message messageVoyageContacted(
            @RequestParam(name = "idSender", defaultValue = "-1" ) Long idSender,
            @RequestParam(name = "idVoyage", defaultValue = "-1" ) Long idVoyage
        ) 
    {
        return messageRepository.messageVoyageContacted(idSender, idVoyage);
    }
}
