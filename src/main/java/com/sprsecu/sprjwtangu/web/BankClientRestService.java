package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.BankClientRepository;
import com.sprsecu.sprjwtangu.entities.BankClient;
import com.sprsecu.sprjwtangu.entities.EmailMessage;
import java.util.ArrayList;
import java.util.Arrays;
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
    public List<BankClient> chercher(@RequestParam(name = "mc", defaultValue = "") String mc)
    {
        //return shipperRepository.chercher("%"+mc+"%", PageRequest.of(page, size));
        return bankClientRepository.chercher("%"+mc+"%");
    }

    @RequestMapping(value = "/emailToAll", method = RequestMethod.POST)
    public void emailToAll(@RequestBody EmailMessage em) throws MessagingException{
        String titre = em.getTitre();
        String contain = em.getContent();
        //List<Address> emails = new ArrayList<>();
        //bankClientRepository.findAll().forEach(client->{
        //System.out.println("em.getAddressCondition() : "+em.getAddressCondition());
        bankClientRepository.chercher("%"+em.getAddressCondition()+"%").forEach(client->{
            //System.out.println("client.getNom() - client.getAddress() : "+client.getNom() +" - "+ client.getAddress());
            if(EmailValidator.getInstance().isValid(client.getEmail())){
                //System.out.println("client.getEmail : "+ client.getEmail());
                try {
                    //emails.add(new InternetAddress(client.getEmail()));
                    generateAndSendEmail(contain, client.getEmail(), titre);
                } catch (AddressException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (MessagingException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        //generateAndSendEmail(contain, emails, titre);
    }
    
    public void generateAndSendEmail(String emailBody, String email, String titre) throws AddressException, MessagingException {
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
        generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        generateMailMessage.setSubject(titre+",");

        //* parse emailBody to find each line
        List<String> lines =Arrays.asList(emailBody.split("\n"));
        StringBuilder bodyModified = new StringBuilder("");
        lines.forEach(line->{
            line=line+"<br>";
            bodyModified.append(line);
            //System.out.println("line : "+ line);
        });
        //System.out.println("lines : "+ lines);
        //System.out.println("lines.toString() : "+ lines.toString());
        //System.out.println("bodyModified.toString() : "+ bodyModified.toString());
        generateMailMessage.setContent(bodyModified.toString() , "text/html");
        //*/
        Transport transport = getMailSession.getTransport("smtp");
	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "dlink4449");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();
    }
}
