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
public class FlatBed implements Serializable{
    @Id @GeneratedValue
    private Long id;    
    private boolean camion_complet;
    private boolean chargement_partiel;
    private boolean p53_ess2; // flat bed 53 pieds et 2 essieux
    private boolean p53_ess3; // flat bed 53 pieds et 3 essieux
    private boolean p53_ess4; // flat bed 53 pieds et 4 essieux
    private boolean p48_ess2; // flat bed 48 pieds et 2 essieux
    private boolean p48_ess3; // flat bed 48 pieds et 3 essieux
    private boolean p48_ess4; // flat bed 48 pieds et 4 essieux
    private boolean stepdeck_p53_ess2; // step deck 53 pieds et 2 essieux
    private boolean stepdeck_p53_ess3; // step deck 53 pieds et 3 essieux
    private boolean stepdeck_p53_ess4; // step deck 53 pieds et 4 essieux
    private boolean stepdeck_p48_ess2; // step deck 48 pieds et 2 essieux
    private boolean stepdeck_p48_ess3; // step deck 48 pieds et 3 essieux
    private boolean stepdeck_p48_ess4; // step deck 48 pieds et 4 essieux
    private boolean fardieu_ess2; // fardieu 2 essieux
    private boolean fardieu_ess3; // fardieu 3 essieux
    private boolean fardieu_ess4; // fardieu 4 essieux
    private boolean fardieu_ess5; // fardieu 5 essieux
    private boolean minideck_ess2; // minideck 2 essieux
    private boolean minideck_ess3; // minideck 3 essieux
    private boolean minideck_ess4; // minideck 4 essieux
    private boolean minideck_ess5; // minideck 5 essieux
    
    private Long id_camion;
    
}
