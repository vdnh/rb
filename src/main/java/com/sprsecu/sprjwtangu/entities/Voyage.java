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
public class Voyage implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    @Temporal(TemporalType.DATE)
    private Date dateArrive;
    private String origin;
    private String destination;
    private Float radiusOrigin;
    private Float radiusDestination;
    // il vaut mieur de garder coordonees
    private Double originLat;
    private Double originLong;
    private Double destLat;
    private Double destLong;
    //
    private String typeCamion="";
    private String optionVoyage="";
    private Boolean chercheCorridor;
    private Long idTransporter;
    private String nomTransporter;
    private String paths; // coordonees de polygon en text
    private String idsDemandeMatchings; // ids de Demandes matching avec ce Voyage
    private String idsDemandePasBesoins; // ids de Demandes matching mais pas besoins
    private String idsDemandeContactes; // ids de Demandes contactes
    public void setDateDepart(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.dateDepart = null; 
        else this.dateDepart = ft.parse(date.toString()); //Date.from(Instant.parse(date.toString()));// (date.); 
    }
}
