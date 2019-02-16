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
public class Demande implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    @Temporal(TemporalType.DATE)
    private Date dateArrive;
    private Float longueur;
    private Float largeur;
    private Float hauteur;
    private Float poids;
    private Float valeur;
    private Float distance;
    private String origin;
    private String destination;
    private Long totalpoints;
    private Float prixSugere;
    private String typeCamion;
    private String roleDemander; // possiblement SHIPPER ou TRANSPORTER ou ADMIN
    private Long idDemander;   // dans le cas SHIPPER ou TRANSPORTER 
    private String nomDemander; // possiblement SHIPPER ou TRANSPORTER
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.dateDepart = null; 
        else this.dateDepart = ft.parse(date.toString());
    }
}