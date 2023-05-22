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
public class Garantie implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private String nom;
    private Float prix;
    @Temporal(TemporalType.DATE)
    private Date expiration;
    private String note;    
    
    public void setDate(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.expiration = null; 
        else this.expiration = ft.parse(date.toString());
    }
}
