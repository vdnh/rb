package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

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
public class Terminal implements Serializable {
    @Id @GeneratedValue
    private Long id;
    private Long idTransporter;
    private Long idTruck;
    private Long idDriver;
    private String name; //name
    private String unitTruck; //truck unit or we can take the name detail of truck, or more info truck
    
    private Double latitude;
    private Double longitude;
    
    private Double direction; // 0.00 - 359.99 -- north-east-south-west;    
    private Double speed;
    private Integer stopDuration=0; // in minute
    private Long timeStop; // the time when terminal stopped;  new Date().getMilisecond()
    private boolean status; // exploit or non
    
    private String loginName;
    private String password;    
    
    private String accepts=""; // all devices accepted
    private String tempora=""; // to write something temporary
}
