package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.util.Date;
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
public class EntretienControl implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date ent1Fait;
    private Long odo1Fait;
    private Date ent2Fait;
    private Long odo2Fait;
    private Date ent3Fait;
    private Long odo3Fait;
    private Date ent4Fait;
    private Long odo4Fait;
    private Date ent5Fait;
    private Long odo5Fait;
    private Date ent6Fait;
    private Long odo6Fait;
    private Date ent7Fait;
    private Long odo7Fait;
    private Date ent8Fait;
    private Long odo8Fait;    
}
