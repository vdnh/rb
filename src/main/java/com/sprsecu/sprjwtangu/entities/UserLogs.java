package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
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
public class UserLogs implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String usernameLogin;
    private String role;
    private String entreprise;
    private String entrepriseId; // userId in browser
    private String token;  // LongText in mySQL
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date loginTime;
    @Temporal(TemporalType.TIMESTAMP)
    private Date logoutTime;
    private int duration; // minutes
    private Double longtitude;
    private Double latitude;
    private String ipLocal;
    private String ipPublic;
    private String place; // where user login
    private String internetProvider;
}
