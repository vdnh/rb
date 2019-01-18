package com.sprsecu.sprjwtangu;

import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.dao.TransporterRepository;
import com.sprsecu.sprjwtangu.entities.Camion;
import com.sprsecu.sprjwtangu.entities.EntretienControl;
import com.sprsecu.sprjwtangu.entities.MessagesConstants;
import com.sprsecu.sprjwtangu.entities.Transporter;
import com.sprsecu.sprjwtangu.web.TransporterRestService;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.List;
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
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author vdnh
 */
public class FreadEntretiens { //extends Thread{

    static Properties mailServerProperties;
    static Session getMailSession;
    static MimeMessage generateMailMessage;
    
    @Autowired
    private TransporterRepository transporterRepository;
    @Autowired
    private CamionRepository camionRepository;
    TransporterRestService trService= new TransporterRestService();
    List<Transporter> transporters;// = transporterRepository.findAll();
    //List<Camion> camions;
    /*
    public String transporterEntretien(Transporter transporter){
        List<Camion> camions = camionRepository.camionsDeTransporter(transporter.getId());
        StringBuilder sb = new StringBuilder("");
        camions.forEach(camion->{
            if((camion.getOdometre()-camion.getOdo1Fait())>=20000l)
                sb.append(MessagesConstants.ent1).append("<br>");
            if((camion.getOdometre()-camion.getOdo2Fait())>=45000l)
                sb.append(MessagesConstants.ent2).append("<br>");
            if((camion.getOdometre()-camion.getOdo3Fait())>=95000l)
                sb.append(MessagesConstants.ent3).append("<br>");
            if(camion.getFilHydrolique()>0 && (camion.getOdometre()-camion.getOdo4Fait())>=camion.getFilHydrolique()-5000)
                sb.append(MessagesConstants.ent4).append("<br>");
            if(camion.getFilAntigel()>0 && (camion.getOdometre()-camion.getOdo5Fait())>=camion.getFilAntigel()-5000)
                sb.append(MessagesConstants.ent5).append("<br>");
            if(camion.getHuileAntigel()>0 && (camion.getOdometre()-camion.getOdo6Fait())>=camion.getHuileAntigel()-5000)
                sb.append(MessagesConstants.ent6).append("<br>");
            if(camion.getHuileTransmission()>0 && (camion.getOdometre()-camion.getOdo7Fait())>=camion.getHuileTransmission()-5000)
                sb.append(MessagesConstants.ent7).append("<br>");
            if(camion.getHuileDifferentiel()>0 && (camion.getOdometre()-camion.getOdo8Fait())>=camion.getHuileDifferentiel()-5000)
                sb.append(MessagesConstants.ent8).append("<br>");
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM/yyyy");
            Date date =Date.from(Instant.now());
            if(camion.getInspect6m()!=null && ((date.getTime()-camion.getInspect6m().getTime())/24/60/60/1000)>=152)
                sb.append(MessagesConstants.inspec1).append(sdf.format(camion.getInspect6m())).append("<br>");
        });
        return sb.toString();
    }
    //*/
    //@Override
    public void runTest(List<Transporter> transporters) {
        //while(true){
            try {
                //generateAndSendEmail();
                //transporters = transporterRepository.findAll();
                //transporters = trService.getTranspoters();
                transporters.forEach(transporter->{
                    //System.out.println(transporterEntretien(transporter)); 
                    System.out.println("transporter : "+transporter.getId()); 
                });
                //Thread.sleep(86400000);
                //Thread.sleep(60000);
            } catch (Exception ex) {
                Logger.getLogger(FreadEntretiens.class.getName()).log(Level.SEVERE, null, ex);
            }
        //}
        //}
    }
    public void generateAndSendEmail() throws AddressException, MessagingException {
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
	//generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress("sosprestige@gmail.com"));
	generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress("vdnh@yahoo.com"));
        generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("vdnh@yahoo.com"));
        //generateMailMessage.setSubject("Greetings from vdnh..");
        generateMailMessage.setSubject("Entretien faut faire,");
	//String emailBody = "Test email by vdnh JavaMail API example. " + "<br><br> Regards, <br>vdnh Admin";
        String emailBody = getTasksByOdo(80000l) + "<br> Regards, <br>Application CTS.COM";
	generateMailMessage.setContent(emailBody, "text/html");
	Transport transport = getMailSession.getTransport("smtp");
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
            sb.append(MessagesConstants.ent1).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=45000l)
            //System.out.println(MessagesConstants.ent2);
            sb.append(MessagesConstants.ent2).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent3);
            sb.append(MessagesConstants.ent3).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent4);
            sb.append(MessagesConstants.ent4).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent5);
            sb.append(MessagesConstants.ent5).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent6);
            sb.append(MessagesConstants.ent6).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent7);
            sb.append(MessagesConstants.ent7).append("<br>");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent8);       
            sb.append(MessagesConstants.ent8).append("<br>");
        //System.out.println(sb.toString());
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM/yyyy");
        Date date =Date.from(Instant.now());
        if(((date.getTime()-entretien.getInspect01().getTime())/24/60/60/1000)>=152)
            sb.append(MessagesConstants.inspec1).append(sdf.format(entretien.getInspect01())).append("<br>");
        return sb.toString();
    }
}
