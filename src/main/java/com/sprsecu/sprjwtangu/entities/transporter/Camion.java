package com.sprsecu.sprjwtangu.entities.transporter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author admin
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Camion {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double longtitude;
    private Double latitude;
    private int status; // 1-en voyage, 2-pas de voyage, 3-en pause, 4-en panne
    @ManyToOne (fetch = FetchType.EAGER)
    private Transporter transporter = new Transporter();

}
