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
public class BonDeTravail implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date date;
    private Long idCamion;
    private String technicien;
    private Boolean mecanique=false;
    private Boolean carrosserie=false;
    private Boolean piece=false;
    private Boolean sablageAuJet=false;
    private Boolean entreposage=false;
    private String remarque;
    private Float sousTotal;
    private Float tps;
    private Float tvq;
    private Float total;
    // status
    private Boolean fini=false;
    private Long odometre;
    
    public void setDate(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.date = null; 
        else this.date = ft.parse(date.toString());
    }
}
