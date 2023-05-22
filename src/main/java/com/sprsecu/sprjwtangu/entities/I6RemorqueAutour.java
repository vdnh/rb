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
public class I6RemorqueAutour implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;   
    // eclairage et signalisation
    private Boolean feuxPosition;
    private Boolean feuxLateraux;
    private Boolean feuxDirection;
    private Boolean feuxDetresse;
    private Boolean feuxRecul;
    private Boolean feuxGabarit;
    private Boolean feuxIdentification;
    private Boolean feuxPlaque;
    private Boolean feuxArret;
    private Boolean reflecteurs;
    private Boolean bandesReflechissantes;
    //unit de refrigeration
    private Boolean batterie;
    private Boolean reservoirCarburant;
    private Boolean attachesCanalisation;
    private Boolean systemeAlimentation;
    private Boolean portillonBouchon;
    //dispositif d'attelage
    private Boolean selletteAttelage;
    private Boolean selletteAjustable;
    private Boolean crochet;
    private Boolean bogieReglable;
    private Boolean plaqueAccouplement;
    private Boolean chevilleOuvriere;
    private Boolean priseFichePourFreins;
    private Boolean priseFichePourElectricite;
    // espace de chargement
    private Boolean plateForme;
    private Boolean panneaux;
    private Boolean butees;
    private Boolean fixations;
    // roulement
    private Boolean pneus;
    private Boolean rouesValves;
    private Boolean boulonsEcrous;
    private Boolean roueSecours;
    private Boolean roulementsRoue;
    // autres equipement
    private Boolean gardeBoue;
    private Boolean parechocs;
    private Boolean odometre;
    
}
