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
public class Camion implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String unite; //numero unite
    private String plaque;
    private String marque;
    private String niv; // numero identificatrion vehicule (numero serie)
    private String modele;
    private String annee;
    private String type; // remorque:1, semiRemorque:2, camionPorteur:3, tracteur:4, camionfermee:5, flatbed:6, autres:7...
    private Long odometre; 
    @Temporal(TemporalType.DATE)
    private Date inspect6m; // jj-mmm,  On fait l'inspection 2 fois chaque annee
    //private Date inspect02; // jj-mmm
    private Long ent1 = 25000l;
    private Long ent2 = 50000l;
    private Long ent3 = 100000l;
    private Long filHydrolique; // km a changer filtre hydrolique
    private Long filAntigel; // km a changer filtre antigel
    private Long huileAntigel; // km a changer d'huile antigel
    private Long huileTransmission; // km a changer d'huile transmission
    private Long huileDifferentiel; // km a changer d'huile differentiel
    private String message01="";
    private String message02="";
    private String message03="";
    private String message04="";
    private String message05="";
    private String message06="";
    private String message07="";
    private String message08="";
    
    private Double longtitude;
    private Double latitude;
    private boolean status; //en mission ou non
    private String localDepart;
    private String destination;    
    // Entretien Control
    @Temporal(TemporalType.DATE)
    private Date ent1Fait;
    private Long odo1Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent2Fait;
    private Long odo2Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent3Fait;
    private Long odo3Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent4Fait;
    private Long odo4Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent5Fait;
    private Long odo5Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent6Fait;
    private Long odo6Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent7Fait;
    private Long odo7Fait=0l;
    @Temporal(TemporalType.DATE)
    private Date ent8Fait;
    private Long odo8Fait=0l;    
    //private Date inspect01 = new Date("10-jul-2018");
    
    private Long idFichePhysiqueEntretien; // faut creer 1 ligne dans la table FichePhysiqueEntretien chaque fois creer 1 ligne Camion
    private Long idFichePhysiqueEntretienCont; // faut creer 1 ligne dans la table FichePhysiqueEntretienCont chaque fois creer 1 ligne Camion
    //private Long idEntretienControl;  // faut creer 1 ligne dans la table EntretienControl chaque fois creer 1 ligne Camion
    private Long idTransporter;
}
