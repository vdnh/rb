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
public class ExpenseFixed implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    private String name; // Name of expense
//    private String dateDoneText; // date in text
//    @Temporal(TemporalType.DATE)
//    private Date dateDone; // date in Date
    private Double perMonth; //=false;
    private Double perYear; //=false;
    private Double fee; // fee before tax
    private String period; // Name of expense

    private String note; // note
    private Boolean archived; // use to archive the old expense fixed
    
    private String dateSinceText; // dateSince in text
    @Temporal(TemporalType.DATE)
    private Date dateSince; // dateSince in Date

    private String dateUntilText; // dateUntil in text
////    @Temporal(TemporalType.DATE)
    private Date dateUntil; // dateUntil in Date
}