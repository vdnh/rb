package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.time.Instant;
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
public class Voyage implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date dateCree = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateDepart;
    @Temporal(TemporalType.DATE)
    private Date dateArrive;
    private String origin;
    private String destination;
    private Float radiusOrigin;
    private Float radiusDestination;
    private String typeCamion;
    private Boolean chercheCorridor;
    private Long idTransporter;
    private String nomTransporter;
}
