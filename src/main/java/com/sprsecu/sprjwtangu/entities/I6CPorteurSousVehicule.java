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
public class I6CPorteurSousVehicule implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    // direction
    private Boolean barreAccouplementInferieure;
    private Boolean levierCommande;
    private Boolean levierDirection;
    private Boolean levierFusee;
    private Boolean axeFusee;
    private Boolean embouts;
    private Boolean manchons;
    private Boolean jointRotule;
    private Boolean bielleAccouplement;
    private Boolean brasRenvoie;
    // suspension (avant et arriere)
    private Boolean barreTorsion;
    private Boolean barreStabilisatrice;
    private Boolean brasSuspension;
    private Boolean ressorts;
    private Boolean boulonCentral; // etoquiau
    private Boolean ancrage;
    private Boolean jambesForces;
    private Boolean balanciersChaises;
    private Boolean essieux;
    private Boolean soupapeDebattement;
    // carde et chassis
    private Boolean longeronsTraversers;
    private Boolean solivesSoliveaux;
    private Boolean attachesCarrosserie;
    private Boolean attachesParechocs;
    private Boolean supportsTransmission;
    private Boolean silencieuxProtecteur;
    private Boolean tuyauEchappement;
    private Boolean piecesFixation;
    private Boolean brides;
    private Boolean convertisseurCatalytique;
    private Boolean arbreTransmission;
    private Boolean canalisationFlexibleRigideFreins;
    private Boolean canalisationFlexibleRigideCarburant;
    private Boolean plancher;
    private Boolean roueSecours;
}
