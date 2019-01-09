package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
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
public class I6CPorteurAutres implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idCamion;
    private Date dateInspect;
    // tout autre element a inspecter que le proprietaire veut ajouter
    private Boolean deceleDefectuosite;
    @Column(length=1000)
    private String autres; // 
    private String technicien;
}
