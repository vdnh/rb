/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu;

//import org.springframework.boot.CommandLineRunner;

import com.sprsecu.sprjwtangu.dao.AutreEntretienRepository;
import com.sprsecu.sprjwtangu.dao.CamionRepository;
import com.sprsecu.sprjwtangu.dao.TransporterRepository;
import com.sprsecu.sprjwtangu.entities.Camion;
import com.sprsecu.sprjwtangu.entities.Transporter;
import com.sprsecu.sprjwtangu.entities.UniteInfos;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.ComponentScan;

/**
 *
 * @author user
 */
//@SpringBootApplication
//@ComponentScan(basePackages={"com.sprsecu.sprjwtangu"})
public class TestMicroService{
    static Integer count = 0;
//    @Autowired
//    private TransporterRepository transporterRepository;
    List<Transporter> transporters = new ArrayList<>();
    @Autowired
    private static CamionRepository camionRepository;
    //List<Camion> camions = new ArrayList<>();
//    @Autowired
//    private AutreEntretienRepository autreEntretienRepository;
    public static void main(String[] args) {
        System.out.println("Hi everyone, I'm TestMicroService.");
        // Thread update odometre
        Thread updateOdoThread = new Thread(() -> {
            while (true) {
                try {
                    System.out.println("TestMicroService.count: " + TestMicroService.count);
                    TestMicroService.count ++ ;
                    Thread.sleep(10000); // sleep 2 seconds                    
                    //Thread.sleep(86400000); //1000*60*60*24 = 86400000 - 1 jour  - test avec 5 minute 300000
                } catch (Exception e) {
                    System.err.println("Error occurred:" + e);
                }
            }
        });
        updateOdoThread.start();
        
//        
//        // Thread update odometre pour SOS Prestige
//        Thread updateOdoSOSPrestigeThread = new Thread(() -> {
//            List<Camion> truckTers = new ArrayList<>(); // trucks noGps but with terminal
//            List<Camion> truckTersTemp = new ArrayList<>(); // truckTersTemp noGps but with terminal, be used to compare
//            //camions=camionRepository.camionsDeTransporter(8l); // transporterid de SOS Prestige est 8 
//            while (true) {
//                try {
//                    List<Camion> camions = new ArrayList<>();
//                    truckTers.clear();
//                    camions=camionRepository.camionsDeTransporter(8l); // transporterid de SOS Prestige est 8 
//                    System.out.println("Ok, I get data of Trucks");
//                    camions.forEach(camion ->{
//                        // if truck is noGps and with terminal
//                        //if(camion.getIdTerminal()!=null) System.out.println("camion.idTerminal: "+ camion.getIdTerminal());
//                        if(!camion.isGps() && camion.getIdTerminal()!=null && camion.getIdTerminal()>0){
//                            truckTers.add(camion);
//                            //System.out.println("Camion.id + camion.terminalName: "+ camion.getId() + " - " + camion.getNameTerminal());
//                        }
//                    });
//                    // in the cas truckterstemp is nul or truckterstemp is not equal truckters
//                    if(truckTersTemp.isEmpty() || (truckTersTemp.size()!=truckTers.size())){
//                        truckTersTemp = truckTers;
//                        //System.out.println("truckTersTemp.size + truckTers.size : " + truckTersTemp.size() + truckTers.size());
//                    }
//                    else{
//                        truckTersTemp.forEach(truck ->{
//                            if( // if data gps was not changed
//                               Double.compare(truck.getLatitude(), truckTers.get(truckTers.indexOf(truck)).getLatitude())==0
//                                &&
//                               Double.compare(truck.getLongtitude(), truckTers.get(truckTers.indexOf(truck)).getLongtitude())==0
//                            )
//                            {
//                                // and timestop is null ==> must set timestop to current time
//                                if(truckTers.get(truckTers.indexOf(truck)).getTimeStop()== null){
//                                    truckTers.get(truckTers.indexOf(truck)).setTimeStop(System.currentTimeMillis());
//                                    truckTers.get(truckTers.indexOf(truck)).setSpeed(0.00);
//                                    camionRepository.save(truckTers.get(truckTers.indexOf(truck)));
//                                }
//                                
//                            }
//                            else{ // in case the gps data was changed, if timestop!= null must set timestop to null
//                                if(truckTers.get(truckTers.indexOf(truck)).getTimeStop()!=null
//                                        &&
//                                   truckTers.get(truckTers.indexOf(truck)).getTimeStop()>0)
//                                {
//                                    truckTers.get(truckTers.indexOf(truck)).setTimeStop(null);
//                                    camionRepository.save(truckTers.get(truckTers.indexOf(truck)));
//                                }
//                            }
//                        });
//                        // when finished update timeStop for all trucks, set truckterstemp equal truckters
//                        truckTersTemp = truckTers;
//                    }
//                    //System.out.println("Mettre a jour odometre des unites de SOS Prestige");
//                    List<UniteInfos> listUnite = ParseKnownXMLStructure.listUniteInfos("https://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421&location=1");
//                    //https://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421&location=1
//                    if(!listUnite.isEmpty()) {
//                        //System.out.println("listUnite : " + listUnite.toString());
//                        //System.out.println("Sure! listUnite isn't empty!!");
//                        //List<Camion> camions = new ArrayList<>();
//                        //camions=camionRepository.camionsDeTransporter(8l); // transporterid de SOS Prestige est 8 
//                        camions.forEach(camion ->{
//                            /*// if truck is noGps and with terminal
//                            if(!camion.isGps() && camion.getIdTerminal()!=null && camion.getIdTerminal()>0){
//                                truckTers.add(camion);
//                            }//*/
//                            listUnite.forEach(unite->{
//                                if(unite.getUnite().equalsIgnoreCase(camion.getUniteMonitor())){
//                                    camion.setLocation(unite.getLocation());
//                                    camion.setLocalName(unite.getLocalName());
//                                    camion.setForeignName(unite.getForeignName());  // set name at GPS fournisseur for camions
//                                    //camion.setOdometre(new Float(unite.getOdometer()).longValue());
//                                    //camion.setLongtitude(new Double(unite.getLongitude()));
//                                    //camion.setLatitude(new Double(unite.getLatitude()));
//                                    camion.setDirection(Double.parseDouble(unite.getDirection()));
//                                    //System.out.println("unite speed : "+ unite.getSpeed());
//                                    
//                                    // if speed = 0 and odomter hasn't changed OR latitude and longitude haven't changed
//                                    if(
//                                       (Double.parseDouble(unite.getSpeed())==0.00
//                                        &&
//                                        Long.compare(camion.getOdometre(), new Float(unite.getOdometer()).longValue())== 0
//                                       ) 
//                                            ||
//                                       (Double.compare(camion.getLongtitude(), new Double(unite.getLongitude()))==0
//                                        &&
//                                        Double.compare(camion.getLatitude(), new Double(unite.getLatitude()))==0 
//                                       )
//                                    ){
//                                        //System.out.println("unite.getSpeed())==0.00");
//                                        if(camion.getSpeed()>0.00){
//                                            //System.out.println("camion.getSpeed()>0.00");
//                                            camion.setSpeed(0.00);
//                                            camion.setStopDuration(4);
//                                        }
//                                        else{
//                                            //System.out.println("already - camion.getSpeed()==0.00");
//                                            camion.setStopDuration(camion.getStopDuration()+2);
//                                        }
//                                    }
//                                    else {
//                                        //System.out.println("unite.getSpeed())>0.00");
//                                        camion.setSpeed(new Double(unite.getSpeed()));
//                                        camion.setOdometre(new Float(unite.getOdometer()).longValue());
//                                        camion.setLongtitude(new Double(unite.getLongitude()));
//                                        camion.setLatitude(new Double(unite.getLatitude()));
//                                        camion.setStopDuration(0);
//                                    }
//                                    camionRepository.save(camion);
//                                    //System.out.println("save camion unite monitor : "+camion.getUniteMonitor()+" unite : "+camion.getUnite()+" : "+unite.getOdometer());
//                                }
//                            });
//                        });
//                    }
//                    Thread.sleep(120150);  // 1000*60*5 = 300000 ms - 5 minutes -- 120000 ms - 2 minutes  - here we exces 150ns for sure every time
//                } catch (Exception e) {
//                    System.err.println("Error occurred:" + e);
//                }
//            } 
//        });
//        
//        //envoiMsgThread.start();
//        updateOdoSOSPrestigeThread.start();
    }
    
//    public static void main(String[] args) {
//            TestMicroService.run(TestMicroService.class, args);
//    }
//
//    public static void run(Class<TestMicroService> aClass, String[] args) {
//        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
//    }
//    //updateOdoThread.start();
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("Hi everyone, I'm TestMicroService.");
//        // Thread update odometre
//        Thread updateOdoThread = new Thread(() -> {
//            while (true) {
//                try {
//                    System.out.println("TestMicroService.count: " + TestMicroService.count);
//                    TestMicroService.count ++ ;
//                    Thread.sleep(10000); // sleep 2 seconds                    
//                    //Thread.sleep(86400000); //1000*60*60*24 = 86400000 - 1 jour  - test avec 5 minute 300000
//                } catch (Exception e) {
//                    System.err.println("Error occurred:" + e);
//                }
//            }
//        });
//        updateOdoThread.start();
//    }
}
