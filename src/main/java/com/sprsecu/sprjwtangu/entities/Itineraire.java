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
public class Itineraire  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date dateCreate;
        
    private String origin="";
    private String destination="";
    
    @Temporal(TemporalType.DATE)
    private Date datePick;
    @Temporal(TemporalType.DATE)
    private Date dateDrop;
    
    private Float longueur;
    private String camionAttribue="";
    
    private Long idCamion;
    private Long idPickStone; // Repere Pick
    private Long idDropStone; // Repere Drop
    
    private Long idRouteFather; // to find route father if there is
    private Long idRouteFatherF1; // to find route father F1 if there is

    private Long idEntreprise;  // bientot id de Shipper
    private Long idTransporter;  // id de Transporter
    private Float distance=0.00f;
    
    // il vaut mieur de garder coordonees
    private Double originLat;
    private Double originLong;
    private Double destLat;
    private Double destLong;
    
    private Float dispoReste=0.00f;
    private Float radiusSearch; // radius for search truck in km
    
    private String dPick;
    private String mPick;
    private String yPick;

    private String dDrop;
    private String mDrop;
    private String yDrop;
            
    private Float horstax=0.00f;
    private Float tps=0.00f;
    private Float tvq=0.00f;
    private Float total=0.00f;
    private boolean fini; //Itineraire fini
    private boolean cancelled; //Itineraire cancelled
    private boolean archive; // Itineraire archived after finished, false by default
    private String imgUrl="";
}