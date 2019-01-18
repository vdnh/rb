package com.sprsecu.sprjwtangu;

import org.apache.commons.validator.routines.EmailValidator;
//import static com.sprsecu.sprjwtangu.ThreadEntretiens.mailServerProperties;
import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.dao.RoleRepository;
import com.sprsecu.sprjwtangu.dao.TransporterRepository;
//import com.sprsecu.sprjwtangu.dao.TaskRepository;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import com.sprsecu.sprjwtangu.entities.Camion;
import com.sprsecu.sprjwtangu.entities.MessagesConstants;
import com.sprsecu.sprjwtangu.entities.Transporter;
//import com.sprsecu.sprjwtangu.entities.Task;
import com.sprsecu.sprjwtangu.services.AccountService;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SprjwtanguApplication implements CommandLineRunner{
    static Properties mailServerProperties;
    static Session getMailSession;
    static MimeMessage generateMailMessage;
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    AccountService  accountService;
    
    @Autowired
    private TransporterRepository transporterRepository;
    List<Transporter> transporters = new ArrayList<>();
    @Autowired
    private CamionRepository camionRepository;
    List<Camion> camions = new ArrayList<>();
    
    public static void main(String[] args) {
            SpringApplication.run(SprjwtanguApplication.class, args);
    }

/*/    
    @Bean
    public BCryptPasswordEncoder getBCPE(){
        return new BCryptPasswordEncoder();
    }
//*/
    @Override
    public void run(String... args) throws Exception {
        /*
        taskRepository.save(new Task(Long.getLong("1"), "task01"));
        taskRepository.save(new Task(Long.getLong("2"), "task02"));
        Stream.of("ADMIN","USER","MANAGER").forEach(r->{
            //roleRepository.save(new AppRole(null, r));
            accountService.saveRole(new AppRole(null, r));
        });
        roleRepository.findAll().forEach(r -> {
            System.out.println("Role : " + r.getRoleName());
        });
        
        Stream.of("admin","user","manager").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, u.toUpperCase());
            //userRepository.save(new AppUser(null, u, u, null));
        });
        accountService.addRoleToUser("admin", "USER");
        accountService.addRoleToUser("admin", "MANAGER");
        accountService.addRoleToUser("manager", "USER");
        userRepository.findAll().forEach(u -> {
            System.out.println("User : "+u.getUsername()+" - Role : "+u.getRoles().toString());
        });
        
        Stream.of("T1","T2","T3").forEach(t->{
            taskRepository.save(new Task(null, t));
        });
        taskRepository.findAll().forEach(t ->{
            System.out.println("taskName : "+t.getTaskName());
        });
        //*/
        
        /*/ for shipper and transporter
        Stream.of("SHIPPER","TRANSPORTER").forEach(r->{
            accountService.saveRole(new AppRole(null, r));
        });
        roleRepository.findAll().forEach(r -> {
            System.out.println("Role : " + r.getRoleName());
        });
        //*/
        /*//
        Stream.of("shipper1","shipper2").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, "SHIPPER");
            //userRepository.save(new AppUser(null, u, u, null));
        });
        //accountService.addRoleToUser("shipper", "SHIPPER");
        //accountService.addRoleToUser("transporter", "TRANSPORTER");
        userRepository.findAll().forEach(u -> {
            System.out.println("User : "+u.getUsername()+" - Role : "+u.getRoles().toString());
        });
        //*/
        /*
        Stream.of("user","manager","shipper","transporter").forEach(u -> {
            accountService.saveUser(new AppUser(null, u, u, null));
            accountService.addRoleToUser(u, u.toUpperCase());
            //userRepository.save(new AppUser(null, u, u, null));
        });//*/
//        accountService.saveUser(new AppUser(null, "shipper01", "shipper01", null));
//        accountService.addRoleToUser("shipper01", "SHIPPER");
    
        // les tasks qui fonctionnent chaque 1 minute
//        int i=0;
//        System.out.println("Values List of i, i est initie : "+i);
//        while(true){
//            Thread.sleep(60000);
//            System.out.println("voici : "+ i++);
//        }
        
        /*/ this thread run by side the main program, it check and send nessacery message to transporter 1 time per day 
        Thread threadBySide = new ThreadBySide();
        threadBySide.start();
        //*/
        /*
        this.transporters=this.transporterRepository.findAll();
        this.transporters.forEach(transporter->{
            System.out.println("transporter email : "+ transporter.getEmail());
            System.out.println("Message entretiens : "+ transporterEntretien(transporter));
        });
        //*/
    Thread running = new Thread(new Runnable() { 
     @Override 
     public void run() { 
      while (true) { 
       try {
           
           //System.out.println("Hi from thread dans spring application");
           transporters=transporterRepository.findAll();
           transporters.forEach(transporter->{
               if(EmailValidator.getInstance().isValid(transporter.getEmail()))
               //try {
                   //generateAndSendEmail(
                   transporterEntretien(transporter);//, transporter.getEmail());
//               } catch (MessagingException ex) {
//                   Logger.getLogger(SprjwtanguApplication.class.getName()).log(Level.SEVERE, null, ex);
//               }
               //System.out.println("transporter email : "+ transporter.getEmail());
               //System.out.println("Message entretiens : "+ transporterEntretien(transporter));
            });
           Thread.sleep(86400000);
        //handle the data 
       } catch (Exception e) { 
        System.err.println("Error occurred:" + e); 
       } 
      } 
     } 
    }); 

    running.start(); 
    }
    
        public void generateAndSendEmail(String emailBody, String email) throws AddressException, MessagingException {
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");

	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
	//generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress("sosprestige@gmail.com"));
//        InternetAddress emailChecked = new InternetAddress();
//        try {
//            emailChecked = new InternetAddress(email);
//            emailChecked.validate();
//        } catch (AddressException ex) {
//            return;
//        }
            //System.out.println("email check : "+emailChecked.toString());
	generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("vdnh@yahoo.com"));
        //generateMailMessage.setSubject("Greetings from vdnh..");
        generateMailMessage.setSubject("Entretien à faire,");
	//String emailBody = "Test email by vdnh JavaMail API example. " + "<br><br> Regards, <br>vdnh Admin";
        emailBody = emailBody + "<br> Regards, <br>Application CTS.COM";
	generateMailMessage.setContent(emailBody, "text/html");
	Transport transport = getMailSession.getTransport("smtp");
	transport.connect("smtp.gmail.com", "vdnhmtl@gmail.com", "mickey&9");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();
    }
    public String transporterEntretien(Transporter transporter){
        this.camions = camionRepository.camionsDeTransporter(transporter.getId());
        //System.out.println("Numero Unite : "+this.camions.size()+"<br>");
        //StringBuilder sb = new StringBuilder("");
        //if(this.camions.size()>0)            
            //this.camions.forEach(camion->{System.out.println("Je suis un camion."+camion.getInspect6m());});
        this.camions.forEach(camion->{
            StringBuilder sb = new StringBuilder("");
            if(camion.getOdometre()!=null){ 
                sb.append("Camion Unite : "+camion.getUnite()+"<br>");
                if(camion.getOdo1Fait()!=null && (camion.getOdometre()-camion.getOdo1Fait())>=20000l)
                    sb.append(MessagesConstants.ent1).append("<br>");
                if(camion.getOdo2Fait()!=null && (camion.getOdometre()-camion.getOdo2Fait())>=45000l)
                    sb.append(MessagesConstants.ent2).append("<br>");
                if(camion.getOdo3Fait()!=null && (camion.getOdometre()-camion.getOdo3Fait())>=95000l)
                    sb.append(MessagesConstants.ent3).append("<br>");
                if(camion.getOdo4Fait()!=null && camion.getFilHydrolique()!=null && camion.getFilHydrolique()>0 && (camion.getOdometre()-camion.getOdo4Fait())>=camion.getFilHydrolique()-5000)
                    sb.append(MessagesConstants.ent4).append("<br>");
                if(camion.getOdo5Fait()!=null && camion.getFilAntigel()!=null && camion.getFilAntigel()>0 && (camion.getOdometre()-camion.getOdo5Fait())>=camion.getFilAntigel()-5000)
                    sb.append(MessagesConstants.ent5).append("<br>");
                if(camion.getOdo6Fait()!=null && camion.getHuileAntigel()!=null && camion.getHuileAntigel()>0 && (camion.getOdometre()-camion.getOdo6Fait())>=camion.getHuileAntigel()-5000)
                    sb.append(MessagesConstants.ent6).append("<br>");
                if(camion.getOdo7Fait()!=null && camion.getHuileTransmission()!=null && camion.getHuileTransmission()>0 && (camion.getOdometre()-camion.getOdo7Fait())>=camion.getHuileTransmission()-5000)
                    sb.append(MessagesConstants.ent7).append("<br>");
                if(camion.getOdo8Fait()!=null && camion.getHuileDifferentiel()!=null && camion.getHuileDifferentiel()>0 && (camion.getOdometre()-camion.getOdo8Fait())>=camion.getHuileDifferentiel()-5000)
                    sb.append(MessagesConstants.ent8).append("<br>");
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM/yyyy");
                Date date =Date.from(Instant.now());
                if(camion.getInspect6m()!=null && ((date.getTime()-camion.getInspect6m().getTime())/24/60/60/1000)>=152)
                    sb.append(MessagesConstants.inspec1).append(sdf.format(camion.getInspect6m())).append("<br>");
                //*
                if(sb.indexOf("Entretien")==-1 && sb.indexOf("Inspection")==-1)
                    sb.setLength(0);// = new StringBuilder("");//*/
                if(!sb.toString().isEmpty()){
                    //System.out.println("sb is : " + sb.toString());
                    try {
                        generateAndSendEmail(sb.toString(), transporter.getEmail());
                    } catch (MessagingException ex) {
                        //return;
                    }
                }
            }
        });//*/
        //if(sb.indexOf("Entretien")==-1 && sb.indexOf("Inspection")==-1)
        return "";
        //return sb.toString();
    }
}
