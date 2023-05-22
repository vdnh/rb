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
public class Repere  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date dateCreate;
    
    private String nom="";
    private String address="";
    
    private Float radius=100.00f; // en metre
    
    private Long idEntreprise;  // bientot id de Shipper
    private Long idTransporter;  // id de Transporter
    
    // il vaut mieur de garder coordonees
    private Double originLat;
    private Double originLong;
}
