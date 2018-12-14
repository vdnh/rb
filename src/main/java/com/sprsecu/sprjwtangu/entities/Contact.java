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
public class Contact implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private String prenom;
    private String fonction;
    private String email;
    private long tel;
    private long fax;
    private String photo;
    private long id_shipper;
    private long id_transporter;
    private long id_manager;
}
