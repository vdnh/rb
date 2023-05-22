package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.BankClientRepository;
import com.sprsecu.sprjwtangu.entities.BankClient;
import com.sprsecu.sprjwtangu.entities.EmailMessage;
import java.io.IOException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
//import java.util.Base64;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
//import javafx.scene.shape.Path;
import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
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
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.codec.binary.Base64;
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

    @RequestMapping(value = "/emailAttachment", method = RequestMethod.POST)  // to use with remorquage
//    @RequestParam("name") String name, 
    public void emailAttachment(@RequestBody EmailMessage em) throws IOException, MessagingException {
        
        String titre = em.getTitre();
        String contain = em.getContent();
        mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);

        Transport transport = getMailSession.getTransport("smtp");
//	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "Dlink$$$9");
        transport.connect("smtp.gmail.com", "automate.cts@gmail.com", "jfglprtpuhlqffwz");
        
        // begin treatment file attachment
        //
        String tempStr= em.getAttachement();
//        System.out.println("attachment : " + tempStr);
        byte[] data = Base64.decodeBase64(tempStr.substring(tempStr.indexOf(",")+1));
//        byte[] data = Base64.getDecoder().decode(tempStr.substring(tempStr.indexOf(",")+1));
//        String originalInput = tempStr.substring(tempStr.indexOf(",")+1);// "dGVzdCBpbnB1dA==";
//        byte[] result = DatatypeConverter.parseBase64Binary(originalInput);
//        String path = "test0305.pdf";
//        String path2 = "test0305-02.pdf";
        try 
//            (OutputStream stream = new FileOutputStream(path))
        {
//            stream.write(data);
//            stream.close();
            Files.write(Paths.get(em.getNameAttached()), data);
        }
        catch (Exception e){
            System.out.println("Couldn't write to file ..");
        }

        // end treatment file attachment and uploaded in avatarFile
        
        boolean eListValid = true;
        if(em.getEmailDest().contains(",")){            
            String[] eList=em.getEmailDest().split(",");
            for (int i = 0; i <eList.length; i++) {
                //System.out.println("Send to:" + eList[i]);
                if(!EmailValidator.getInstance().isValid(eList[i]))
                    eListValid=false;
            }
            if(eListValid){
                try {
                    generateAndSendEmailAttachment(contain, em.getEmailDest(), titre, transport, em.getNameAttached());
                } catch (AddressException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (MessagingException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        else if(EmailValidator.getInstance().isValid(em.getEmailDest())){
            //System.out.println("client.getEmail : "+ client.getEmail());
            try {
                generateAndSendEmailAttachment(contain, em.getEmailDest(), titre, transport, em.getNameAttached());
            } catch (AddressException ex) {
                Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (MessagingException ex) {
                Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
            }
        }        
        
        //*we can move Transport to EmailAll function to avoid login many time
        transport.close();
        // delete file after sent
        Files.deleteIfExists(Paths.get(em.getNameAttached()));
    }

    @RequestMapping(value = "/email", method = RequestMethod.POST)  // to use with remorquage
    public void email(@RequestBody EmailMessage em) throws MessagingException{
        String titre = em.getTitre();
        String contain = em.getContent();
        mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);

        Transport transport = getMailSession.getTransport("smtp");
//	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "Dlink$$$9");
        transport.connect("smtp.gmail.com", "automate.cts@gmail.com", "jfglprtpuhlqffwz");
        //*/
        // check list if valid or not
        //System.out.println("em.getEmailDest() : " + em.getEmailDest());
        boolean eListValid = true;
        if(em.getEmailDest().contains(",")){            
            String[] eList=em.getEmailDest().split(",");
            for (int i = 0; i <eList.length; i++) {
                //System.out.println("Send to:" + eList[i]);
                if(!EmailValidator.getInstance().isValid(eList[i]))
                    eListValid=false;
            }
            if(eListValid){
                try {
                    generateAndSendEmail(contain, em.getEmailDest(), titre, transport);
                } catch (AddressException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (MessagingException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        else if(EmailValidator.getInstance().isValid(em.getEmailDest())){
            //System.out.println("client.getEmail : "+ client.getEmail());
            try {
                generateAndSendEmail(contain, em.getEmailDest(), titre, transport);
            } catch (AddressException ex) {
                Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (MessagingException ex) {
                Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
            }
        }        
        
        //*we can move Transport to EmailAll function to avoid login many time
        transport.close();
        //*/
        //generateAndSendEmail(contain, emails, titre);
    }
    
    @RequestMapping(value = "/emailToAll", method = RequestMethod.POST)
    public void emailToAll(@RequestBody EmailMessage em) throws MessagingException{
        String titre = em.getTitre();
        String contain = em.getContent();
        //List<Address> emails = new ArrayList<>();
        //bankClientRepository.findAll().forEach(client->{
        //System.out.println("em.getAddressCondition() : "+em.getAddressCondition());
        //* we can move Transport to EmailAll function to avoid login many time
        mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);

        Transport transport = getMailSession.getTransport("smtp");
//	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "Dlink$$$9");
        transport.connect("smtp.gmail.com", "automate.cts@gmail.com", "jfglprtpuhlqffwz");
        
        //*/
	        
        bankClientRepository.chercher("%"+em.getAddressCondition()+"%").forEach(client->{
            //System.out.println("client.getNom() - client.getAddress() : "+client.getNom() +" - "+ client.getAddress());
            if(EmailValidator.getInstance().isValid(client.getEmail())){
                //System.out.println("client.getEmail : "+ client.getEmail());
                try {
                    //emails.add(new InternetAddress(client.getEmail()));
                    generateAndSendEmail(contain, client.getEmail(), titre, transport);
                    Thread.sleep(2000);
                } catch (AddressException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (MessagingException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (InterruptedException ex) {
                    Logger.getLogger(BankClientRestService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        //*we can move Transport to EmailAll function to avoid login many time
        transport.close();
        //*/
        //generateAndSendEmail(contain, emails, titre);
    }
    
    public void generateAndSendEmail(String emailBody, String email, String titre, Transport transport) throws AddressException, MessagingException {
	/*
        mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
        //*/
	generateMailMessage = new MimeMessage(getMailSession);
        
        // to make list of emails if there are multiple address (23-09-2019)
        //System.out.println("email : " + email);
        if(email.contains(",")){
            String[] eList=email.split(",");
            InternetAddress[] sendTo = new InternetAddress[eList.length];
            for (int i = 0; i <eList.length; i++) {
                //System.out.println("Send to:" + eList[i]);
                sendTo[i] = new InternetAddress(eList[i]);
            }
            generateMailMessage.addRecipients(Message.RecipientType.TO, sendTo);    
        }
        // add else to this pharse to treat is case IF
        else generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        // end of making list of emails if there are multiple address (23-09-2019)
        
        generateMailMessage.setSubject(titre+",");
        //generateMailMessage.setSender(new InternetAddress("5147283785@vmobile.ca")); // teste to add sender , but don't work 

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
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	/*we can move Transport to EmailAll function to avoid login many time
        transport.close();
        //*/
    }
    
    public void generateAndSendEmailAttachment(String emailBody, String email, String titre, Transport transport, String nameAttached) throws AddressException, MessagingException, IOException {

	generateMailMessage = new MimeMessage(getMailSession);
        
        // to make list of emails if there are multiple address (23-09-2019)
        //System.out.println("email : " + email);
        if(email.contains(",")){
            String[] eList=email.split(",");
            InternetAddress[] sendTo = new InternetAddress[eList.length];
            for (int i = 0; i <eList.length; i++) {
                //System.out.println("Send to:" + eList[i]);
                sendTo[i] = new InternetAddress(eList[i]);
            }
            generateMailMessage.addRecipients(Message.RecipientType.TO, sendTo);    
        }
        // add else to this pharse to treat is case IF
        else generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        // end of making list of emails if there are multiple address (23-09-2019)
        
        generateMailMessage.setSubject(titre+",");
        //generateMailMessage.setSender(new InternetAddress("5147283785@vmobile.ca")); // teste to add sender , but don't work 

        //* parse emailBody to find each line
        List<String> lines =Arrays.asList(emailBody.split("\n"));
        StringBuilder bodyModified = new StringBuilder("");
        lines.forEach(line->{
            line=line+"<br>";
            bodyModified.append(line);
            //System.out.println("line : "+ line);
        });
        // in case there is attachement
        if(nameAttached!=null && nameAttached.length()>0) {
            System.out.println("There are attachement");
            
            BodyPart messageBodyPart = new MimeBodyPart(); 
            // messageBodyPart.setText("Mail Body");
            messageBodyPart.setContent(bodyModified.toString(), "text/html");
            MimeBodyPart attachmentPart = new MimeBodyPart();
//            attachmentPart.attachFile("test0305.pdf"); //(attachment);  // here exist file in string type
            attachmentPart.attachFile(nameAttached);
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);
            multipart.addBodyPart(attachmentPart);
            // message.setContent(multipart);
            generateMailMessage.setContent(multipart);
        }
        
        // in case there isn't attachement
        else
            generateMailMessage.setContent(bodyModified.toString() , "text/html");
        //*/
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	/*we can move Transport to EmailAll function to avoid login many time
        transport.close();
        //*/
    }
}
