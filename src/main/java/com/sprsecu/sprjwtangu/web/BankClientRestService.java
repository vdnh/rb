package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.BankClientRepository;
import com.sprsecu.sprjwtangu.entities.BankClient;
import com.sprsecu.sprjwtangu.entities.EmailMessage;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.apache.commons.validator.routines.EmailValidator;
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
@CrossOrigin("*")public class BankClientRestService {
    
    static Properties mailServerProperties;
    static Session getMailSession;
    static MimeMessage generateMailMessage;
    
    @Autowired BankClientRepository bankClientRepository;
    
    @RequestMapping(value = "/bankClients", method = RequestMethod.GET)
    public List<BankClient> getBankClients(){
        return bankClientRepository.findAll();
    }
    
    @RequestMapping(value = "/bankClients/{id}", method = RequestMethod.GET)
    public BankClient getClient(@PathVariable Long id){
        return bankClientRepository.findById(id).get();
    }
    
    @RequestMapping(value = "/bankClients", method = RequestMethod.POST)
    public BankClient save(@RequestBody BankClient c){
        return bankClientRepository.save(c);
    }
    
    @RequestMapping(value = "/bankClients/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        bankClientRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/bankClients", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        bankClientRepository.deleteById(id);
        return true;
    }
    
    @RequestMapping(value = "/bankClients/{id}", method = RequestMethod.PUT)
    public BankClient updateContact(@PathVariable Long id, @RequestBody BankClient c){
        c.setId(id);
        return bankClientRepository.save(c);
    }    
    
    @RequestMapping(value = "/chercherClients", method = RequestMethod.GET)
    public Page<BankClient> chercher(
            @RequestParam(name = "mc", defaultValue = "") String mc, 
            @RequestParam(name = "page", defaultValue = "0")int page, 
            @RequestParam(name = "size", defaultValue = "5")int size)
    {
        return bankClientRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
    }

    @RequestMapping(value = "/emailToAll", method = RequestMethod.POST)
    public void emailToAll(@RequestBody EmailMessage em) throws MessagingException{
        String titre = em.getTitre();
        String contain = em.getContent();
        List<InternetAddress> emails = new ArrayList<>();
        bankClientRepository.findAll().forEach(client->{
            if(EmailValidator.getInstance().isValid(client.getEmail())){
                try {
                    emails.add(new InternetAddress(client.getEmail()));
                } catch (AddressException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        generateAndSendEmail(contain, emails, titre);
    }
    
    public void generateAndSendEmail(String emailBody, List<InternetAddress> emails, String titre) throws AddressException, MessagingException {
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
        //InternetAddress[] es = emails.toArray();
	//generateMailMessage.addRecipient(Message.RecipientType.TO, emails.toArray());
        generateMailMessage.addRecipients(Message.RecipientType.TO, (InternetAddress[]) emails.toArray());
        generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("vdnh@yahoo.com"));

        generateMailMessage.setSubject(titre+",");
        //generateMailMessage.addRecipients(Message.RecipientType.TO, new Address[]);
        //emailBody = emailBody + "<br> Regards, <br>Application CTS.COM";
	generateMailMessage.setContent(emailBody, "text/html");

        Transport transport = getMailSession.getTransport("smtp");
	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "dlink4449");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();
    }
}
