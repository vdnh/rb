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
public class History implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    private String dateDoneText; // date in text
    @Temporal(TemporalType.DATE)
    private Date dateDone; // date in Date
    private String note; // note history
    private Boolean sent=false; // false do not sent yet, true have been sent
    private Boolean memo = false; // use just case history of drive, false : evenement, true: memo 
}
