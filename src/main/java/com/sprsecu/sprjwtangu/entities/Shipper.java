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
public class Shipper {
    @Id @GeneratedValue
    private Long id; // to identify shipper
    private String nom; // enterprise's name
    private String raison_sociale;
    @Temporal(TemporalType.DATE)
    private Date depuis;
    private String email;
    private long tel;
    private long fax;
    private String photo;
    private boolean status = false;
    private String login_name;
    private String password;    
}
