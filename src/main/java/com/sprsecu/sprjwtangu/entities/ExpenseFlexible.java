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
public class ExpenseFlexible implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    private String name; // Name of expense
    private String dateDoneText; // date in text
    @Temporal(TemporalType.DATE)
    private Date dateDone; // date in Date
    private Double fee; // fee before tax
    private Long odo; // fee before tax
    private Long idWorkOrder; // id of workorder
    private String note; // note
}