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
public class Camion implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private String plaque;
    private Long longtitude;
    private Long latitude;
    private boolean status;
    private Long id_transporter;
}
