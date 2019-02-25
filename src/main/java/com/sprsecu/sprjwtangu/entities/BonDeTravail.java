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
public class BonDeTravail implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date date;
    Long idCamion;
    private Boolean mecanique=false;
    private Boolean carrosserie=false;
    private Boolean piece=false;
    private Boolean sablageAuJet=false;
    private Boolean entreposage=false;
    private String remarque;
    private Float sousTotal;
    private Float tps;
    private Float tvq;
    private Float total;
}
