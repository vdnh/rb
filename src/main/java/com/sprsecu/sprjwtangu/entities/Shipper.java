package com.sprsecu.sprjwtangu.entities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
//import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
//import javax.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
//@Table(uniqueConstraints={@UniqueConstraint(columnNames={"login_name"})})
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class Shipper {
    @Id @GeneratedValue
    private Long id; // to identify shipper
    private String nom; // enterprise's name
    private String raison_sociale;
    @Temporal(TemporalType.DATE)
    private Date depuis;
    private String email;
    private long tel;
    private long fax;
    private String photo;
    private boolean status = false;
    //@Column(unique=true)
    //@Column(name = "login_name")
    @Column(unique = true)
    private String loginName;
    private String password;    
    
    // prix remorquage (bas - km - inclus)
    private Float prixBase1=0.00f;
    private Float prixKm1=0.00f;
    private Float inclus1=0.00f; 
    private Float prixBase2=0.00f;
    private Float prixKm2=0.00f;
    private Float inclus2=0.00f;
    private Float prixBase3=0.00f;
    private Float prixKm3=0.00f;
    private Float inclus3=0.00f;
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.depuis = null; 
        else this.depuis = ft.parse(date.toString());
    }
}
