package com.sprsecu.sprjwtangu.entities;

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
public class BankClient {
    @Id @GeneratedValue
    private Long id; 
    private String nom;
    private String contact;
    private String address;
    private String raison_sociale;
    @Temporal(TemporalType.DATE)
    private Date depuis;
    private String email;
    private String tel;
    private String fax;
}
