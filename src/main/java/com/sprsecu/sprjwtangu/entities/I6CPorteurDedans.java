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
public class I6CPorteurDedans implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    //accesoires
    private Boolean pareBrise;
    private Boolean pareSoleil;
    private Boolean glacesLaterales;
    private Boolean retroInterieur;
    private Boolean banquettes;
    private Boolean ceintureSecurite;
    private Boolean coussinsGonflables;
    private Boolean lampesTemoins;
    // moteur en marche
    private Boolean volant;
    private Boolean demarrageAuNeutre;
    private Boolean commandeAccelerateur;
    private Boolean commandeEmbrayage;
    private Boolean commandeFreins;
    private Boolean manometreFreins;
    private Boolean compresseurAir;
    private Boolean avertisseursSonoreLuminaire;
    private Boolean freinService;
    private Boolean freinsUrgenceStationnement;
    private Boolean coursePedaleFrein;
    private Boolean essuieGlaceFonction;
    private Boolean laveGlace;
    private Boolean chauffageDegivrage;
    private Boolean indicateurVitesseTotalisateur;
    private Boolean eclairageTableauBord;
    private Boolean klaxon;
    private Boolean feuxJour;
    private Boolean pharesRoute;
    private Boolean pharesCroisement;
    private Boolean feuxDirection;
    private Boolean feuxArret;
    private Boolean feuxPosition;
    private Boolean feuxPlaque;
    private Boolean feuxDetresse;
    private Boolean feuxRecul;
    private Boolean feuxGabarit;
    private Boolean feuxIdentification;
    private Boolean reflecteurs;
    // moteur arrete
    private Boolean systemeAssistance;  // systeme de freins hydroliques assiste
    private Boolean baissePressionAppliFrein; // une application de freins
    private Boolean baissePressionAppli1Minute; // frein applique 1 minute
}
