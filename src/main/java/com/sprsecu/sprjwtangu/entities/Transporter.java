package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
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
public class Transporter implements Serializable{
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
    
    private Long lastNumber; // to keep the last number of confirmation
    private String nir;  // license de circulation
    private String nid;  // company number
    private String expressContact; // if there are many names, separate with /
    private String address;
    private String ville;
    private String codePostal;
    private String initial;  // example SP, LG, ... in capital
    private String taxProvince;  // Quebec, Ontario, ....
    
    private Boolean evaluation = false; // true = in evaluation
    private Boolean alreadyEvaluated = false;
    @Temporal(TemporalType.DATE)
    private Date beginDateEvaluate;
    @Temporal(TemporalType.DATE)
    private Date beginDatePlan;
    @Temporal(TemporalType.DATE)
    private Date endDatePlan;
    private Long dispatchs;
    private Long technicians;
    private Integer trucks;
    private Integer clientsPros;
    private Integer terminals;
    
    private String planActual;
    @Temporal(TemporalType.DATE)
    private Date dateEndTrial;
    private Float basePrice;
    private Integer daysPlan; // days total of plan name

    // date for plan in milliseconds
    // private Long dateOrderMillis;
    private Long dateEndingMillis;
    // private Long datePayedMillis;
    private Long dateEndTrialMillis;
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.depuis = null; 
        else this.depuis = ft.parse(date.toString());
    }    
}
