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
public class LoadFrequent implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idTransporter;
    private Long idShipper;
    private String nom;
    private String description;
    private Float longueur;
    private Float largeur;
    private Float hauteur;
    private Float poids;
    
    private Float priceBase;
    private Float priceMinimum;
    private Float priceKmType1; // <=100 kms
    private Float priceKmType2; // >100 kms
}
