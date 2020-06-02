package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.Column;
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
public class Remorquage implements Serializable{
    @Id @GeneratedValue
    private Long id;
    //@Temporal(TemporalType.DATE)
    //private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    //@Temporal(TemporalType.DATE)
    //private Date dateArrive;
    
    private String nomEntreprise=""; // bientot nom de Shipper
    private String nomClient="";
    private String telClient="";
    private String timeCall;
    private String timeResrvation;
    // add more
    @Temporal(TemporalType.DATE)
    private Date dateReserve;
    private String driverNote="";
    private String telClient2em="";
    private String numPO=""; // Pucharge Number
    private String nomContact="";
    private String telContact="";
    private String extTelContact="";
    private String emailContact="";
    private String marque="";
    private String modele="";
    private String plaque="";
    private String couleur="";
    private String serie="";
    private String nomIntervenant="";
    private String telIntervenant="";
    private String emailIntervenant="";
    private Long idEntreprise;  // bientot id de Shipper
    private Long idTransporter;  // id de Transporter
    private Boolean sent=false; // sent or didn't send to driver
    private String nomDispatch="";
    private String camionAttribue="";
    private String signature="";
    private String nomSignature="";
    private Float porterAuCompte=0.00f; 
    private Float collecterArgent=0.00f; 
    private Boolean valid=false; // valid=true after save bon
    private String imgUrl="";
    
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
    private String typeService;
    // services
    private Boolean panne=false;
    private Boolean accident=false;
    private Boolean pullOut=false;
    private Boolean debaragePorte=false;
    private Boolean survoltage=false;
    private Boolean essence=false;
    private Boolean changementPneu=false;
    private Boolean autres=false;
    //fin de service
    
    //Mode payement
    private Boolean debit=false; // porter au compte
    private Boolean atPlace=false; // collecter d'argent
    private Boolean byCash=false; // cash
    private Boolean byCheck=false; // cheque
    private Boolean creditCard=false; // carte credit
    private Boolean byInterac=false; // interac
    private Boolean transfer=false; // virement
    //fin mode payement
    
    // text export
    @Column(columnDefinition = "text")
    private String sage;
    @Column(columnDefinition = "text")
    private String excel;
    //
    
    // status
    private Boolean fini=false;
    // situation
    private Boolean rush=false;  // se ruer, urgent
    //
    //prix total
    private Boolean taxable=true;
    private Float horstax=0.00f;
    private Float tps=0.00f;
    private Float tvq=0.00f;
    private Float total=0.00f;
    //fin de prix total
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
