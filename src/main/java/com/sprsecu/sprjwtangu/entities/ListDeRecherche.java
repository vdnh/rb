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
public class ListDeRecherche implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String longueur;
    private String largeur;
    private String hauteur;
    private String poids;
    private String valeur;
    private String distance;
    private String origin;
    private String destination;
    @Temporal(TemporalType.DATE)
    private Date dateRecherche;
    private String typeCamion; // 1, 2, ... veut dire : camionFermee, flat_bed, ...
    private Long id_shipper;
}
