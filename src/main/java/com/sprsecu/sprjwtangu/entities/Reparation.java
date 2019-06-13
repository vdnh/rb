package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
public class Reparation implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idBon;
    private String reparationEffectuer;
    private String piece;
    private String fournisseur;
    @Temporal(TemporalType.DATE)
    private Date garantie;
    private Float quantite;
    private Float prixUnite;
    private Float heures;
    private Float taux;
    private Float prix;
    // status
    private Boolean saved=false;
    
    public void setDate(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.garantie = null; 
        else this.garantie = ft.parse(date.toString());
    }
}
