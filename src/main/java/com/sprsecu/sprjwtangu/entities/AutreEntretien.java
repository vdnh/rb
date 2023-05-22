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
public class AutreEntretien implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private String nom;
    private Long kmTrage; // km a faire
    private Long kmAvertir=5000l; //km a avertir avant
    private Long odoFait;
    @Temporal(TemporalType.DATE)
    private Date dateFait;
    private Long dateFaitMiliseconds;
    private String message="";
    
    private Boolean sendEmail=false; // need send email or not, by default no need -  false
    private Integer daysTodo; // number of days to do this task
    private Integer daysToWarn; // number of days to begin warn this task
}
