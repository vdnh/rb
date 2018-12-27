package com.sprsecu.sprjwtangu.entities;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
//import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
//import javax.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
//@Table(uniqueConstraints={@UniqueConstraint(columnNames={"login_name"})})
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
    //@Column(unique=true)
    //@Column(name = "login_name")
    @Column(unique = true)
    private String loginName;
    private String password;    
}
