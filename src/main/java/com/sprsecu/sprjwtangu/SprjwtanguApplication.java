package com.sprsecu.sprjwtangu;

import com.sprsecu.sprjwtangu.dao.AutreEntretienRepository;
import org.apache.commons.validator.routines.EmailValidator;
//import static com.sprsecu.sprjwtangu.ThreadEntretiens.mailServerProperties;
import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.dao.RoleRepository;
import com.sprsecu.sprjwtangu.dao.TransporterRepository;
//import com.sprsecu.sprjwtangu.dao.TaskRepository;
import com.sprsecu.sprjwtangu.dao.UserRepository;
import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import com.sprsecu.sprjwtangu.entities.AutreEntretien;
import com.sprsecu.sprjwtangu.entities.Camion;
import com.sprsecu.sprjwtangu.entities.MessagesConstants;
import com.sprsecu.sprjwtangu.entities.Transporter;
import com.sprsecu.sprjwtangu.entities.UniteInfos;
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
    //List<Camion> camions = new ArrayList<>();
    @Autowired
    private AutreEntretienRepository autreEntretienRepository;
    
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
        
        // Thread envoi message aux transporters
        Thread envoiMsgThread = new Thread(() -> {
            while (true) {
                try {
                    System.out.println("Entretiens check");
                    //* activer pour vrai checker
                    this.transporters=transporterRepository.findAll();
                    this.transporters.forEach(transporter->{
                        if(EmailValidator.getInstance().isValid(transporter.getEmail()))
                            transporterEntretien(transporter);
                    });
                    //*/
                    Thread.sleep(86400000); //1000*60*60*24 = 86400000 - 1 jour  - test avec 5 minute 300000
                } catch (Exception e) {
                    System.err.println("Error occurred:" + e);
                }
            } 
        }); 
        
        // Thread update odometre pour SOS Prestige
        Thread updateOdoSOSPrestigeThread = new Thread(() -> {
            List<Camion> camions = new ArrayList<>();
            camions=camionRepository.camionsDeTransporter(8l); // transporterid de SOS Prestige est 8 
            while (true) {
                try {
                    System.out.println("Mettre a jour odometre des unites de SOS Prestige");
                    List<UniteInfos> listUnite = ParseKnownXMLStructure.listUniteInfos("http://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421");
                    if(!listUnite.isEmpty()) {
                        System.out.println("listUnite : " + listUnite.toString());
                        System.out.println("Sure! listUnite isn't empty!!");
                        camions.forEach(camion ->{
                            listUnite.forEach(unite->{
                                if(unite.getUnite().equalsIgnoreCase(camion.getUniteMonitor())){
                                    camion.setOdometre(new Float(unite.getOdometer()).longValue());
                                    camion.setLongtitude(new Double(unite.getLongitude()));
                                    camion.setLatitude(new Double(unite.getLatitude()));
                                    camionRepository.save(camion);
                                    //System.out.println("save camion unite monitor : "+camion.getUniteMonitor()+" unite : "+camion.getUnite()+" : "+unite.getOdometer());
                                }
                            });
                        });
                    }
                    Thread.sleep(120000);  // 1000*60*5 = 300000 ms - 5 minutes -- 120000 ms - 2 minutes
                } catch (Exception e) {
                    System.err.println("Error occurred:" + e);
                }
            } 
        });
        
        //envoiMsgThread.start();
        updateOdoSOSPrestigeThread.start(); 
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
	//System.out.println(emailBody); // imprimer a la place de  email
        //*
        Transport transport = getMailSession.getTransport("smtp");
	transport.connect("smtp.gmail.com", "cts.solution.transport@gmail.com", "dlink4449");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();//*/
    }
    public String transporterEntretien(Transporter transporter){
        System.out.println("Transporter : " + transporter.getNom());
        List<Camion> camions = new ArrayList<>();
        camions = camionRepository.camionsDeTransporter(transporter.getId());
        //System.out.println("Numero Unite : "+this.camions.size()+"<br>");
        //StringBuilder sb = new StringBuilder("");
        //if(this.camions.size()>0)            
            //this.camions.forEach(camion->{System.out.println("Je suis un camion."+camion.getInspect6m());});
        camions.forEach(camion->{
            StringBuilder sb = new StringBuilder("");
            if(camion.getOdometre()!=null){ 
                //List<AutreEntretien> autreEnts = autreEntretienRepository.findByIdCamion(camion.getId());
                sb.append("Camion Unite : "+camion.getUnite()+"<br>");
                /*
                if(camion.getOdo1Fait()!=null && (camion.getOdometre()-camion.getOdo1Fait())>=20000l)
                    sb.append(MessagesConstants.ent1).append("<br>");
                if(camion.getOdo2Fait()!=null && (camion.getOdometre()-camion.getOdo2Fait())>=45000l)
                    sb.append(MessagesConstants.ent2).append("<br>");
                if(camion.getOdo3Fait()!=null && (camion.getOdometre()-camion.getOdo3Fait())>=95000l)
                    sb.append(MessagesConstants.ent3).append("<br>");//*/
                sb.append(codeTextEnts(camion));
                //System.out.println("Message de 3 premiers entretiens : " + sb.toString());
                /*
                sb.append(codeTextEnt1(camion));
                System.out.println("sb1: "+sb.toString());
                sb.append(codeTextEnt2(camion));
                System.out.println("sb2: "+sb.toString());
                sb.append(codeTextEnt3(camion));
                System.out.println("sb3: "+sb.toString());//*/
                if(camion.getOdo4Fait()!=null && camion.getFilHydrolique()!=null && camion.getFilHydrolique()>0 && (camion.getOdometre()-camion.getOdo4Fait())>=camion.getFilHydrolique()-5000)
                  //  sb.append(MessagesConstants.ent4).append("<br>");
                sb.append(codeText(camion.getOdo4Fait(), camion.getFilHydrolique(), camion.getOdometre(), MessagesConstants.ent4));
                if(camion.getOdo5Fait()!=null && camion.getFilAntigel()!=null && camion.getFilAntigel()>0 && (camion.getOdometre()-camion.getOdo5Fait())>=camion.getFilAntigel()-5000)
                //    sb.append(MessagesConstants.ent5).append("<br>");
                sb.append(codeText(camion.getOdo5Fait(), camion.getFilAntigel(), camion.getOdometre(), MessagesConstants.ent5));
                if(camion.getOdo6Fait()!=null && camion.getHuileAntigel()!=null && camion.getHuileAntigel()>0 && (camion.getOdometre()-camion.getOdo6Fait())>=camion.getHuileAntigel()-5000)
                //    sb.append(MessagesConstants.ent6).append("<br>");
                sb.append(codeText(camion.getOdo6Fait(), camion.getHuileAntigel(), camion.getOdometre(), MessagesConstants.ent6));
                if(camion.getOdo7Fait()!=null && camion.getHuileTransmission()!=null && camion.getHuileTransmission()>0 && (camion.getOdometre()-camion.getOdo7Fait())>=camion.getHuileTransmission()-5000)
                //    sb.append(MessagesConstants.ent7).append("<br>");
                sb.append(codeText(camion.getOdo7Fait(), camion.getHuileTransmission(), camion.getOdometre(), MessagesConstants.ent7));
                if(camion.getOdo8Fait()!=null && camion.getHuileDifferentiel()!=null && camion.getHuileDifferentiel()>0 && (camion.getOdometre()-camion.getOdo8Fait())>=camion.getHuileDifferentiel()-5000)
                //    sb.append(MessagesConstants.ent8).append("<br>");
                sb.append(codeText(camion.getOdo8Fait(), camion.getHuileDifferentiel(), camion.getOdometre(), MessagesConstants.ent8));                                
                //* traite des autres entretiens
                List<AutreEntretien> autreEnts = autreEntretienRepository.findByIdCamion(camion.getId());
                if (autreEnts!=null){
                    autreEnts.forEach(autreEnt->{
                        sb.append(codeTextAutreEnts(autreEnt, camion.getOdometre()));
                    });
                }
                //*/
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
                        System.out.println(""+sb.toString());
                        //generateAndSendEmail(sb.toString(), transporter.getEmail());
                    } catch (Exception ex) {
                        //return;
                    }
                }
            }
        });//*/
        //if(sb.indexOf("Entretien")==-1 && sb.indexOf("Inspection")==-1)
        return "";
        //return sb.toString();
    }
    public String  msgEnt1(Camion camion){
        if(camion.getOdo1Fait()!=null && (camion.getOdometre()-camion.getOdo1Fait())>=camion.getEnt1()-5000
                && (camion.getOdo1Fait()!=camion.getOdo2Fait()))
            return camion.getMessage01() + ("<br>");
        return msgEnt2(camion);
    }
    public String  msgEnt2(Camion camion){
        if(camion.getOdo2Fait()!=null && (camion.getOdometre()-camion.getOdo2Fait())>=camion.getEnt2()-5000
                && (camion.getOdo2Fait()!=camion.getOdo3Fait()))
            return camion.getMessage01() + ("<br>")+camion.getMessage02();
        return msgEnt3(camion);
    }
    public String  msgEnt3(Camion camion){
        if(camion.getOdo3Fait()!=null && (camion.getOdometre()-camion.getOdo3Fait())>=camion.getEnt3()-5000)
            return camion.getMessage01() + ("<br>")+camion.getMessage02()+("<br>")+camion.getMessage03();
        return "";
    }
    
    public String codeTextEnt1(Camion camion){
        System.out.println("Unite : "+ camion.getUnite()+" "+ camion.getOdo1Fait()+" "+camion.getOdo2Fait()+" "+camion.getOdo3Fait()+" "+camion.getOdometre());
        if(camion.getOdo1Fait()!=camion.getOdo2Fait())
          return "";//codeTextEnt2(camion);
//        if(camion.getEnt1()==0 || camion.getEnt1()==null || camion.getOdometre()==null)      
//          return "";
        if((camion.getOdometre()-camion.getOdo1Fait())<(camion.getEnt1()-5000))
          return "";
        if((camion.getOdometre()-camion.getOdo1Fait())<camion.getEnt1())
          return "Attention : " + camion.getMessage01();
        if((camion.getOdometre()-camion.getOdo1Fait())>=camion.getEnt1())
          return "Urgent : " + camion.getMessage01();
        return "";
    }
    public String codeTextEnt2(Camion camion){
        System.out.println("Unite : "+ camion.getUnite()+" "+ camion.getOdo1Fait()+" "+camion.getOdo2Fait()+" "+camion.getOdo3Fait()+" "+camion.getOdometre());
        if(camion.getOdo1Fait()!=camion.getOdo2Fait())
          return "";//codeTextEnt3(camion);
//        if(camion.getEnt2()==0 || camion.getEnt2()==null || camion.getOdometre()==null)      
//          return "";
        if((camion.getOdometre()-camion.getOdo2Fait())<(camion.getEnt2()-5000))
          return "";
        if((camion.getOdometre()-camion.getOdo2Fait())<camion.getEnt2())
          return "Attention : " + camion.getMessage01()+ camion.getMessage02();
        if((camion.getOdometre()-camion.getOdo2Fait())>=camion.getEnt2())
          return "Urgent : " +  camion.getMessage01() + camion.getMessage02();
        return "";
    }
  public String codeTextEnt3(Camion camion){
    System.out.println("Unite : "+ camion.getUnite()+" "+ camion.getOdo1Fait()+" "+camion.getOdo2Fait()+" "+camion.getOdo3Fait()+" "+camion.getOdometre());
//    if(camion.getEnt3()==0 || camion.getEnt3()==null || camion.getOdometre()==null)
//      return "";
    if((camion.getOdometre()-camion.getOdo3Fait())<(camion.getEnt3()-5000))
      return "";
    if((camion.getOdometre()-camion.getOdo3Fait())<camion.getEnt3())
      return "Attention : " + camion.getMessage01()+ camion.getMessage02() + camion.getMessage03();
    if((camion.getOdometre()-camion.getOdo3Fait())>=camion.getEnt3())
      return "Urgent : " + camion.getMessage01()+ camion.getMessage02() + camion.getMessage03();
    
      return "";
  }
  
  public String codeTextEnts(Camion camion){
    /*
    System.out.println("Unite : "+ camion.getUnite()+" "+ camion.getOdo1Fait()+" "+camion.getOdo2Fait()+" "+camion.getOdo3Fait()+" "+camion.getOdometre());
    System.out.println("camion.getOdometre()-camion.getOdo1Fait() : "+ (camion.getOdometre()- camion.getOdo1Fait()));
    System.out.println("camion.getOdometre()-camion.getOdo2Fait() : "+ (camion.getOdometre()- camion.getOdo2Fait()));  
    System.out.println("camion.getOdometre()-camion.getOdo3Fait() : "+ (camion.getOdometre()- camion.getOdo3Fait()));
    System.out.println("camion.getMessage01() : "+camion.getMessage01());
    System.out.println("camion.getMessage02() : "+camion.getMessage02());
    System.out.println("camion.getMessage03() : "+camion.getMessage03());//*/
    if((camion.getOdometre()-camion.getOdo3Fait())>(camion.getEnt3()-5000)){
        if((camion.getOdometre()-camion.getOdo3Fait())<camion.getEnt3()){
            return "Attention : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>"+ "* Entretien 2 - "+ camion.getMessage02()+"<br>" + "* Entretien 3 - "+ camion.getMessage03()+"<br>";
        }
        else{
            return "Urgent : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>"+ "* Entretien 2 - "+ camion.getMessage02()+"<br>" + "* Entretien 3 - "+ camion.getMessage03()+"<br>";
        }
    }
    else{
        if((camion.getOdometre()-camion.getOdo2Fait())>(camion.getEnt2()-5000)){
            if((camion.getOdometre()-camion.getOdo2Fait())<camion.getEnt2()){
                return "Attention : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>"+ "* Entretien 2 - "+ camion.getMessage02()+"<br>";
            }
            else{
                return "Urgent : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>"+ "* Entretien 2 - "+ camion.getMessage02()+"<br>";
            }
        }
        else{
            if((camion.getOdometre()-camion.getOdo1Fait())>(camion.getEnt1()-5000)){
                if((camion.getOdometre()-camion.getOdo1Fait())<camion.getEnt1()){
                    return "Attention : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>";
                }
                else{
                    return "Urgent : " +"<br>"+ "* Entretien 1 - "+camion.getMessage01()+"<br>";
                }
            }
        }
    }
    return "";
  }
  
  public String codeTextAutreEnts(AutreEntretien autreEnt, Long odometre){
    //System.out.println("Autre Entretien : " + autreEnt.getNom() +" "+autreEnt.getMessage()+" faire a : "+autreEnt.getKmTrage()+" "+ autreEnt.getOdoFait());
    if(autreEnt==null) return "";
    if((odometre-autreEnt.getOdoFait())>(autreEnt.getKmTrage()-5000)){
        if((odometre-autreEnt.getOdoFait())<autreEnt.getKmTrage()){
            return "Attention : " +"<br>"+ "* Entretien "+autreEnt.getNom()+" - "+autreEnt.getMessage()+"<br>";
        }
        else{
            return "Urgent : " +"<br>"+ "* Entretien "+autreEnt.getNom()+" - "+autreEnt.getMessage()+"<br>";
        }
    }
    return "";
  }
  
    /*
    if(camion.getOdo4Fait()!=null && camion.getFilHydrolique()!=null && camion.getFilHydrolique()>0 && (camion.getOdometre()-camion.getOdo4Fait())>=camion.getFilHydrolique()-5000)
                    sb.append(MessagesConstants.ent4).append("<br>");//*/
  public String codeText(Long odoFait, Long odoAFaire, Long odometre, String message){
    //System.out.println("Autre Entretien : " + autreEnt.getNom() +" "+autreEnt.getMessage()+" faire a : "+autreEnt.getKmTrage()+" "+ autreEnt.getOdoFait());
    if((odometre-odoFait)>(odoAFaire-5000)){
        if((odometre-odoFait)<odoAFaire){
            return "Attention : " +"<br>"+ message+"<br>";
        }
        else{
            return "Urgent : " +"<br>"+ message+"<br>";
        }
    }
    return "";
  }
  //codeText(camion.getOdo4Fait(), camion.getFilHydrolique(), camion.getOdometre(), MessagesConstants.ent4);
}
