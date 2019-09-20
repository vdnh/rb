package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
//import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
    private String nom;
    private String tel;
    private String email;
    private long idTransporter;
}
