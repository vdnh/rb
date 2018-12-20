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
public class CamionFermee implements Serializable{
    @Id @GeneratedValue
    private Long id;    
    private boolean camion_complet;
    private boolean chargement_partiel;
    private boolean p53_ess2; // 53 pieds et 2 essieux
    private boolean p53_ess3; // 53 pieds et 3 essieux
    private boolean p53_ess4; // 53 pieds et 4 essieux
    private boolean p48_ess2; // 48 pieds et 2 essieux
    private boolean p48_ess3; // 48 pieds et 3 essieux
    private boolean p48_ess4; // 48 pieds et 4 essieux
    private boolean porteur26_ess2; // porteur 26 pieds et 2 essieux
    private boolean porteur26_ess3; // porteur 26 pieds et 3 essieux
    private boolean porteur16_18; // porteur 16 - 18 pieds
    private boolean chauffe;
    private boolean refrigere;
    private boolean congele;
    private boolean hayon;
    
    private Long id_camion;    
}
