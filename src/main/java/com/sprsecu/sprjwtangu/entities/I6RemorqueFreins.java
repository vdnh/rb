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
public class I6RemorqueFreins implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    //   generale
    private Boolean freinService;
    private Boolean freinStationnement;
    private Boolean freinUrgence;
    private Boolean arbreCames;
    private Boolean maitreCylindre;
    private Boolean disquesTambours;
    private Boolean cylindresRoues;
    private Boolean garniture;
    private Boolean levierAjustement;
    private Boolean reservoirAir;
    private Boolean soupapeDistribution;
}
