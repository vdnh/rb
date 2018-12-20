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
    private Long id_shipper;
}
