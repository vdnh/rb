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
public class I6CPorteurSousCapot implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    // generale
    private Boolean compresseurAir;
    private Boolean filtreCompresseur;
    private Boolean evaporateur;
    private Boolean courroires;
    private Boolean pompeElectrique; // frein
    private Boolean supportsMoteur;
    private Boolean batteries;
    private Boolean systemeAlimentation;
    private Boolean maitreCylindre;
    private Boolean dispositifAncrageSecurite;
    private Boolean accouplementRoulement;
    private Boolean servodirection;
    private Boolean boitiersDirection;
    private Boolean laveGlace;
    private Boolean collecteurEchappement;
    private Boolean cylindresDirection;
}
