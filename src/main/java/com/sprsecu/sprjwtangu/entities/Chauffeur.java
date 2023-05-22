package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.util.Date;
//import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
//import javax.persistence.Temporal;
//import javax.persistence.TemporalType;
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
public class Chauffeur implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String prenom;
    private String nom;
    private String tel;
    private String email;
    private long idTransporter;
    
    private String imgUrl="";
    @Temporal(TemporalType.DATE)
    private Date entryDate;
    @Temporal(TemporalType.DATE)
    private Date lastDate;
    private Boolean archive=false;
    private String remark=""; // to note all histories in out function
    private String entryDateText=""; // date in text
    private String lastDateText=""; // date in text
}
