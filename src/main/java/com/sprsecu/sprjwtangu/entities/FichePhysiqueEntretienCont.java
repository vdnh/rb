package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
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
public class FichePhysiqueEntretienCont  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private String huileMoteur;
    private String huileDifferentiel;
    private String huileTransmition;
    private String huileServoDirection;
    private String huileHydrolique;
    private String prestone;
    private String batterieNombre;
    private String batterieAmperage;
    private String batterieDimension;
    private String alternateurMarque;
    private String alternateurPiece;
    private String demarreurMarque;
    private String demarreurPiece;
    private String phareAvantMarque;
    private String phareAvantPiece;
    private String lumiaireArriereMarque;
    private String lumiaireArrierePiece;
    private String clignotantAvantMarque;
    private String clignotantAvantPiece;
    private String lumiaireHautPareBriseMarque;
    private String lumiaireHautPareBrisePiece;
    private String essieuxAvantFreinMarque;
    private String essieuxAvantFreinPiece;
    private String essieuxAvantDrumMarque;
    private String essieuxAvantDrumPiece;
    private String essieuxAvantRouesType;
    private String essieuxAvantRouesMarque;
    private String essieuxAvantRouesPiece;
    private String essieuxAvantBearingRouesMarque;
    private String essieuxAvantBearingRouesPiece;
    private String essieuxAvantBoosterMarque;
    private String essieuxAvantBoosterPiece;
    private String essieuxAvantCAMGaucheMarque;
    private String essieuxAvantCAMGauchePiece;
    private String essieuxAvantCAMDroiteMarque;
    private String essieuxAvantCAMDroitePiece;
    private String essieuxArriereFreinMarque;
    private String essieuxArriereFreinPiece;
    private String essieuxArriereDrumMarque;
    private String essieuxArriereDrumPiece;
    private String essieuxArriereRouesType;
    private String essieuxArriereRouesMarque;
    private String essieuxArriereRouesPiece;
    private String essieuxArriereBearingRouesMarque;
    private String essieuxArriereBearingRouesPiece;
    private String essieuxArriereBoosterMarque;
    private String essieuxArriereBoosterPiece;
    private String essieuxArriereCAMGaucheMarque;
    private String essieuxArriereCAMGauchePiece;
    private String essieuxArriereCAMDroiteMarque;
    private String essieuxArriereCAMDroitePiece;//*/
}
