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
public class Camion implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private String nIV; // numero identificatrion vehicule (numero serie)
    private String plaque;
    private String type; // remorque:1, semi-remorque:2, tracteur:3, camionfermee:4, flatbed:5, autres:6...
    private Long odometre; 
    private Date inspect01; // jj-mmm,  On fait l'inspection 2 fois chaque annee
    private Date inspect02; // jj-mmm
    private Long eFilHydrolique; // km a changer filtre hydrolique
    private Long eFilAntigel; // km a changer filtre antigel
    private Long eHuileAntigel; // km a changer d'huile antigel
    private Long eHuileTransmission; // km a changer d'huile transmission
    private Long eHuileDifferentiel; // km a changer d'huile differentiel
    private Long idFicheTechnique;
    private Long longtitude;
    private Long latitude;
    private boolean status; //en mission ou non
    private String localDepart;
    private String destination;    
    private Long idTransporter;
}
