package com.sprsecu.sprjwtangu.entities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.Column;
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
public class Transporter {
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private String raison_sociale;
    @Temporal(TemporalType.DATE)
    private Date depuis;
    private String email;
    private String tel;
    private String fax;
    private String photo;    
    @Column(unique = true)
    private String loginName;
    private String password;
    private String emailTechnic;  // email de personne s'ocuppe la technique
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.depuis = null; 
        else this.depuis = ft.parse(date.toString());
    }    
}
