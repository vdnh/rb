package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
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
public class Remorquage implements Serializable{
    @Id @GeneratedValue
    private Long id;
    //@Temporal(TemporalType.DATE)
    //private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    //@Temporal(TemporalType.DATE)
    //private Date dateArrive;
    
    private String nomEntreprise="";
    private String nomClient="";
    private String telClient="";
    private String timeCall;
    private String timeResrvation;
    
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
    //fin de service
    //prix total
    private Float horstax=0.00f;
    private Float tps=0.00f;
    private Float tvq=0.00f;
    private Float total=0.00f;
    //fin de prix total
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.dateDepart = null; 
        else this.dateDepart = ft.parse(date.toString());
    }
}
