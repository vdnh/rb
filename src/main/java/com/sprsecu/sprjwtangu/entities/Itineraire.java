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

    private Long idEntreprise;  // bientot id de Shipper
    private Long idTransporter;  // id de Transporter
    private Float distance=0.00f;
    
    // il vaut mieur de garder coordonees
    private Double originLat;
    private Double originLong;
    private Double destLat;
    private Double destLong;
    
    private Float horstax=0.00f;
    private Float tps=0.00f;
    private Float tvq=0.00f;
    private Float total=0.00f;
    
}