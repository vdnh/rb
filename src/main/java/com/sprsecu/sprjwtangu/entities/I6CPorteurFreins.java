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
public class I6CPorteurFreins implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    //elements pas encore inspectes
    private Boolean disquesTambours;
    private Boolean cylindreRouesEtriers;
    private Boolean garnitures; //  mesurage
    private Boolean reservoirsAir;
    private Boolean soupapes;
    private Boolean servofrein; 
}
