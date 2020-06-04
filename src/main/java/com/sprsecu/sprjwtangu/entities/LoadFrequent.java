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
public class LoadFrequent implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idTransporter;
    //private Integer quantity;
    private String nom;
    private String description;
    private Float longueur;
    private Float largeur;
    private Float hauteur;
    private Float poids;
}
