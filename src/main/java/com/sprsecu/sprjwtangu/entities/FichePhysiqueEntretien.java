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
public class FichePhysiqueEntretien implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateAchat;
    private String numeroUnite;
    private String marque;
    private String modele;
    private String annee;
    private String km;
    private String couleur1;
    private String codeCouleur1;
    private String couleur2;
    private String codeCouleur2;
    private String couleur3;
    private String codeCouleur3;
    private String moteur;
    private String transmition;
    private String differentiel1Type;
    private String differentiel1Capacite;
    private String differentiel2Type;
    private String differentiel2Capacite;
    private String differentiel3Type;
    private String differentiel3Capacite;
    private String essieuxAvantType;
    private String essieuxAvantCapacite;
    private String pneusAvantModele;
    private String pneusAvantGrandeur;
    private String pneusArriereModele;
    private String pneusArrieregrandeur;
    private String ptoModele;
    private String ptoSerie;
    private String pompeHydroliqueModele;
    private String pompeHydroliqueSerie;
    private String filtreHuile1erMarque;
    private String filtreHuile1erPiece;
    private String filtreHuile2emMarque;
    private String filtreHuile2emPiece;
    private String filtreHuile3emMarque;
    private String filtreHuile3emPiece;
    private String filtreFuel1erMarque;
    private String filtreFuel1erPiece;
    private String filtreFuel2emMarque;
    private String filtreFuel2emPiece;
    private String filtreFuel3emMarque;
    private String filtreFuel3emPiece;
    private String filtreAir1erMarque;
    private String filtreAir1erPiece;
    private String filtreAir2emMarque;
    private String filtreAir2emPiece;
    private String filtreAir3emMarque;
    private String filtreAir3emPiece;
    private String filtrePrestone1erMarque;
    private String filtrePrestone1erPiece;
    private String filtrePrestone2emMarque;
    private String filtrePrestone2emPiece;
    private String filtrePolene1erMarque;
    private String filtrePolene1erPiece;
    private String filtrePolene2emMarque;
    private String filtrePolene2emPiece;
    private String filtreHuileHydrolique1erMarque;
    private String filtreHuileHydrolique1erModele;
    private String filtreHuileHydrolique2emMarque;
    private String filtreHuileHydrolique2emModele;
}
