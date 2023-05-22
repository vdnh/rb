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
public class I6RemorqueSous implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;    
    // cadre et chassis
    private Boolean longgeronsTraversers;
    private Boolean solivesSoliveux;
    private Boolean dispositifLevageSoutien; // bequilles
    private Boolean canalisationFreins;
    private Boolean bridesAttaches;
    private Boolean plancher;
    private Boolean essieux;
    private Boolean pieceFixation;
    // suspension
    private Boolean amortisseurs;
    private Boolean ancrages;
    private Boolean lamesMaitresses;
    private Boolean jumellesRessort;
    private Boolean bridesCentrales;
    private Boolean boulonCentral;
    private Boolean ressorts;
    private Boolean balanciers;
    private Boolean chaisesBalanciers;
    private Boolean ballons;
    private Boolean soupapeDebattement;
    private Boolean piecesFixation;
    private Boolean coussinsCaoutchouc;
    private Boolean barreTorsion;
    private Boolean jambeForce;
    private Boolean suspentionPneumatique;
}
