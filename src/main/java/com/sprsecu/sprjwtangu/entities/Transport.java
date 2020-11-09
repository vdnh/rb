package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
//import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class Transport implements Serializable{
    @Id @GeneratedValue
    private Long id;
    //@Temporal(TemporalType.DATE)
    //private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    //@Temporal(TemporalType.DATE)
    //private Date dateArrive;
    
    private String nomEntreprise=""; // bientot nom de Shipper
    // begin special for contact origin and destination
    private String nomClient="";//nom contact origin
    private String telClient="";//tel1 contact origin
    private String telClient2em="";//tel2 contact origin
    private String contactDest="";//nom contact destination
    private String tel1Dest="";//tel1 contact destination
    private String tel2Dest="";//tel2 contact destination
    // end special for contact origin and destination
    private String timeCall;
    private String timeResrvation;
    // add more
    @Temporal(TemporalType.DATE)
    private Date dateReserve;
    private String driverNote="";
    
    private String numPO=""; // Pucharge Number
    private String nomContact="";
    private String telContact="";
    private String extTelContact="";
    private String emailContact="";
    private String insurrance="";
    private String equifax="";
    private String transCreditCA="";
    private String authority="";
    private String transCreditUS="";
    private String webInfo="";
    private Float longueur=0.00f;
    private Float largeur=0.00f;
    private Float hauteur=0.00f;
    private Float poids=0.00f;
    private Float valeur=0.00f;
    private Long totalpoints;
    private String optionDemande="";
    private String typeCamion="";
    private String askDescription;
    private Integer quantity;

    private String nomIntervenant="";
    private String telIntervenant="";
    private String emailIntervenant="";
    private Long idEntreprise;  // bientot id de Shipper
    private Long idTransporter;  // id de Transporter
    private Boolean sent=false; // sent or didn't send to driver
    private String nomDispatch="";
    private String camionAttribue="";  // name of camion
    private String signature="";
    private String nomSignature="";
    private Float porterAuCompte=0.00f; 
    private Float collecterArgent=0.00f; 
    private Boolean valid=false; // valid=true after save bon
    private String imgUrl="";
    
    // the name of the model usually used
    private String modelName="";
    private Boolean taxable=true;
    private Long idVoyage;  // to identify the voyage he belong
    private Long idCamion;
    private Long idTrailer1;
    private String trailer1="";  // name of trailer1
    private Long idTrailer2;
    private String trailer2="";  // name of trailer2
    //
    private Float distance;
    private String origin;
    private String originAdresse;
    private String originVille;
    private String originProvince;
    private String destination;
    private String destAdresse;
    private String destVille;
    private String destProvince;
    // il vaut mieur de garder coordonees
    private Double originLat;
    private Double originLong;
    private Double destLat;
    private Double destLong;

    private String comments;    // description plus
    
    private Float prixBase=0.00f;
    private Float prixKm=0.00f;
    private Float inclus=0.00f;
    //private String typeService;
    // services
//    private Boolean panne=false;
//    private Boolean accident=false;
//    private Boolean pullOut=false;
//    private Boolean debaragePorte=false;
//    private Boolean survoltage=false;
//    private Boolean essence=false;
//    private Boolean changementPneu=false;
//    private Boolean autres=false;
    //fin de service
    // status
    private Boolean fini=false;
    //
    //prix total
    private Float horstax=0.00f;
    private Float tps=0.00f;
    private Float tvq=0.00f;
    private Float total=0.00f;
    //fin de prix total
    
    // Volume available actual
    private Float longueurDispo;
    private Float largeurDispo;
    private Float hauteurDispo;
    private Float poidsDispo;
    
    //Mode payement
    private Boolean debit=false; // porter au compte
    private Boolean atPlace=false; // collecter d'argent
    private Boolean byCash=false; // cash
    private Boolean byCheck=false; // cheque
    private Boolean creditCard=false; // carte credit
    private Boolean byInterac=false; // interac
    private Boolean transfer=false; // virement
    //fin mode payement
    
    // waiting time and price
    private Float waitingTime;
    private Float waitingPrice; // per hours
    private Float waitingFee;   // = waitingTime * waitingPrice
    
    // PTO time and price
    private Float ptoTime;
    private Float ptoPrice; // per hours
    private Float ptoFee;   // = ptoTime * ptoPrice
    
    private Float loadsFee;   // 
    
    private String taxProvince;  // province where apply tax for this transport
    
    private Integer tyeDoc; // Evaluation=1 or Command=2, reserve for another tpydoc 3 4 5 ....
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null){
            this.dateDepart = null; 
            //this.dateReserve = null;
        }
        else { 
            this.dateDepart = ft.parse(date.toString());
            //this.dateReserve = ft.parse(date.toString());
        }
    }
}
