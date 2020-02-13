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
    private String tel; // old was long
    private String fax; // old was long
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
    private Float prixKm1P=0.00f; // prixKm1P for Panne
    private Float prixKm1A=0.00f; // prixKm1A for Accident
    private Float inclus1=0.00f; 
    private Float prixBase2=0.00f;
    private Float prixKm2=0.00f;
    private Float prixKm2P=0.00f; // prixKm2P for Panne
    private Float prixKm2A=0.00f; // prixKm2A for Accident
    private Float inclus2=0.00f;
    private Float prixBase3=0.00f;
    private Float prixKm3=0.00f;
    private Float prixKm3P=0.00f; // prixKm3P for Panne
    private Float prixKm3A=0.00f; // prixKm3A for Accident
    private Float inclus3=0.00f;
    
    // prix remorquage par cas
    private Float panne1=85.00f;
    private Float panne2=85.00f;
    private Float panne3=85.00f;
    private Float accident1=385.00f;
    private Float accident2=385.00f;
    private Float accident3=385.00f;
    private Float pullOut1=85.00f;
    private Float pullOut2=85.00f;
    private Float pullOut3=85.00f;
    private Float debarragePorte1=65.00f;
    private Float debarragePorte2=65.00f;
    private Float debarragePorte3=65.00f;
    private Float boost1=65.00f;
    private Float boost2=65.00f;
    private Float boost3=65.00f;
    private Float essence1=65.00f;
    private Float essence2=65.00f;
    private Float essence3=65.00f;
    private Float changementPneu1=85.00f;
    private Float changementPneu2=85.00f;
    private Float changementPneu3=85.00f;
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.depuis = null; 
        else this.depuis = ft.parse(date.toString());
    }
}
