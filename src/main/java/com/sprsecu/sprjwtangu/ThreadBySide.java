package com.sprsecu.sprjwtangu;

import com.sprsecu.sprjwtangu.entities.EntretienControl;
import com.sprsecu.sprjwtangu.entities.MessagesConstants;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.scene.shape.Line;

/**
 *
 * @author vdnh
 */
public class ThreadBySide extends Thread{

    static Properties mailServerProperties;
    static Session getMailSession;
    static MimeMessage generateMailMessage;
        
    @Override
    public void run() {
        // les tasks qui fonctionnent chaque 1 minute
        int i=0;
        System.out.println("Values List of i, i est initie : "+i);
        while(true){
            try {
                Thread.sleep(60000);
                generateAndSendEmail();
            } catch (Exception ex) {
                Logger.getLogger(ThreadBySide.class.getName()).log(Level.SEVERE, null, ex);
            }
            System.out.println("voici : "+ i++);
        }
    }
    public void generateAndSendEmail() throws AddressException, MessagingException {
 
	// Step1 - preparation of mail server's status
	System.out.println("\n 1st ===> setup Mail Server Properties..");
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");
	System.out.println("Mail Server Properties have been setup successfully..");
 
	// Step2 - add address destinations and the content email
	System.out.println("\n\n 2nd ===> get Mail Session..");
	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
	generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress("vdnh@yahoo.com"));
	generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("vdnh@yahoo.com"));
        //generateMailMessage.setSubject("Greetings from vdnh..");
        generateMailMessage.setSubject("Entretien faut faire,");
	//String emailBody = "Test email by vdnh JavaMail API example. " + "<br><br> Regards, <br>vdnh Admin";
        String emailBody = getTasksByOdo(80000l) + "<br><br> Regards, <br>Application CTS.COM";
	generateMailMessage.setContent(emailBody, "text/html");
	System.out.println("Mail Session has been created successfully..");
 
	// Step3 - get session mail and set parameters of senders' email - and send mail
	System.out.println("\n\n 3rd ===> Get Session and Send mail");
	Transport transport = getMailSession.getTransport("smtp");
 	// Enter your correct gmail UserID and Password
	// if you have 2FA enabled then provide App Specific Password
	transport.connect("smtp.gmail.com", "vdnhmtl@gmail.com", "mickey&9");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();
    }
    
    public String getTasksByOdo(Long odoActual){
        StringBuilder sb = new StringBuilder("");
        EntretienControl entretien = new EntretienControl();
        //Long odoActual = odo;
        Long odo=22000l;
        entretien.setOdo1Fait(odo);
        entretien.setOdo2Fait(odo);
        entretien.setOdo3Fait(odo);
        entretien.setOdo4Fait(odo);
        entretien.setOdo5Fait(odo);
        entretien.setOdo6Fait(odo);
        entretien.setOdo7Fait(odo);
        entretien.setOdo8Fait(odo);        
        // check Ent1
        
        if((odoActual-entretien.getOdo1Fait())>=20000l)
            //System.out.println(MessagesConstants.ent1);
            sb.append(MessagesConstants.ent1).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=45000l)
            //System.out.println(MessagesConstants.ent2);
            sb.append(MessagesConstants.ent2).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent3);
            sb.append(MessagesConstants.ent3).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent4);
            sb.append(MessagesConstants.ent4).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent5);
            sb.append(MessagesConstants.ent5).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent6);
            sb.append(MessagesConstants.ent6).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent7);
            sb.append(MessagesConstants.ent7).append("<br>\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent8);       
            sb.append(MessagesConstants.ent8).append("<br>\n");
        System.out.println(sb.toString());
        return sb.toString();
    }
}
