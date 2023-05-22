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
public class RemorqueContact implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private Float prixBase1=0.00f;
    private Float prixKm1=0.00f;
    private Float inclus1=0.00f; 
    private Float prixBase2=0.00f;
    private Float prixKm2=0.00f;
    private Float inclus2=0.00f;
    private Float prixBase3=0.00f;
    private Float prixKm3=0.00f;
    private Float inclus3=0.00f;
}
