package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
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
    private String uniteMonitor;
    private String monitor;
    private String plaque;
    private String marque;
    private String niv; // numero identificatrion vehicule (numero serie)
    private String modele;
    private String annee;
    private String type; // remorque:1, semiRemorque:2, camionPorteur:3, tracteur:4, camionfermee:5, flatbed:6, autres:7...
    private String massNet;
    private Long odometre; 
    @Temporal(TemporalType.DATE)
    private Date inspect6m; // jj-mmm,  On fait l'inspection 2 fois chaque annee
    @Temporal(TemporalType.DATE)
    private Date vignetteSaaq; // jj-mmm,  On demande la vignette 1 fois chaque annee
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
    @Temporal(TemporalType.DATE)
    private Date dateAchat; //(add in Camion, delete in fiche)
    private Double price; // price buy truck
    private Double payDown; // sum paydown
    private Double payPerMonth; // pay per month
    private Long termPayment; // number of month to pay
    private Double pricePlate;
    private Double buyBack;
    private Long numberAxles;
    @Temporal(TemporalType.DATE)
    private Date dateSolde;
    
    private Double longtitude;
    private Double latitude;
    private Double direction; // 0.00 - 359.99 -- north-east-south-west;    
    private Double speed;
    private Integer stopDuration=0; // in minute
    private Long timeStop; // the time when terminal stopped;  new Date().getTime()
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
    
    // Available volume (pouce/inch - libre)
    private Float largeur;
    
    private Float longueur; // par defaul est longueur desk bas - en pied
    private Float hauteur; // par defaul est Hauteur de la plateforme - en pouce
    private Float poids;    // par defaul est Capacite de charge - en lbs
    private Float longueurTop; // par defaul est longueur desk haut - en pied
    private boolean rampe; // Rampe
    private boolean loadLeveler; // Load Leveler
    private boolean backTilt; // Inclinaison du derriere
    private Float hauteurDeck; // par defaul est Hauteur de la deck - en pouce
    
    // Camions' Photo 
    private String imgUrl="";
    private String foreignName=""; // name at GPS Supplier
    // Camions' location and name of location
    private String location; // address in AVL
    private String localName; // name in AVL
    
    private Long idCarrier; // id of truck carrying - just for trailer who need a carrier
    private Long idTerminal; // id of terminal if it have terminal
    private String nameTerminal="";
    
    private boolean broker=false; // Truck of broker, false by default
    private boolean outService=false; // out of service for some reason, , false by default
    private boolean trailer=false; // Truck or trailer
    private boolean gps=false; // gps or no, by default is no
    
    private Float l100km; // liters per 100km
    private Float mpg; // miles per km
    
    private String inspect6mLog; // save all date inspect6m
    private String vignetteLog; // save all date vignette
    
    private String equipment; // List equipment
    private String inventory; // stuff in the truck
    
    private String notes; 
    
    public void setDepuis(LocalDate date) throws ParseException{
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd"); 
        if(date == null)
            this.inspect6m = null; 
        else this.inspect6m = ft.parse(date.toString());
    }    
}
