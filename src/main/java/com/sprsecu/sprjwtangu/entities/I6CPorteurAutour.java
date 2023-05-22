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
public class I6CPorteurAutour implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    // cabine-carrosserie
    private Boolean portieres;
    private Boolean retroExterieurs;
    private Boolean essuieGlace;
    private Boolean ailesCarrosserie;
    private Boolean capotCrochet;
    private Boolean pneus;
    private Boolean rouesValves;
    private Boolean boulonsEcrousPiecesFixation;
    private Boolean roulementRoue;
    private Boolean gardeBoue;
    private Boolean reservoirAttaches;
    private Boolean portillonBouchon;
    private Boolean vignetteValide; // carburant, gazeux
    // dispositif d'attelage
    private Boolean selletteAttelage;
    private Boolean mecanismeVerrouillage;
    private Boolean freinsRemorque;
    private Boolean eclairageRemorque;
    private Boolean cablesChainesCrochet;
    // espace de chargement
    private Boolean plateformePanneaux;
    private Boolean butteesFixations;
    private Boolean supportsRidelles;
    // suspention et freins
    private Boolean amortisseur;
    private Boolean ancrages;
    private Boolean lameMaitresse;
    private Boolean bridesCentrales;
    private Boolean piecesFixation;
    private Boolean jumelles;
    private Boolean suspensionPneumatique;
    private Boolean coussinsCaoutchouc;
    private Boolean cylindreFreins;
    private Boolean levierAjustement;
    private Boolean arbreCames;
    
}
