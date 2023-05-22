package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
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

public class DriverLicense implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    
    private String dateExpirationText; // dateExpiration in text
    @Temporal(TemporalType.DATE)
    private Date dateExpiration; // dateExpiration in Date
    private String dateIssuedText; // date in text
    @Temporal(TemporalType.DATE)
    private Date datedateIssued; // date in Date
    
//    private Boolean statut=false; // No-need, auto-calculate from dateExpiration
    private String imgFront="";
    private String imgBack="";
    private String remark="";
    private Boolean theValidity=false; // false is driver license, true is the page validity
}
