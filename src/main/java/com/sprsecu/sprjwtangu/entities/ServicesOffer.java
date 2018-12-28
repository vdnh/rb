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
public class ServicesOffer implements Serializable{
    @Id @GeneratedValue
    private Long id;    
    private boolean entreposage_interieur;
    private boolean entreposage_exterieur;
    private boolean service_transbordage;
    private boolean manutention;
    private boolean cross_polt;
    private Long id_transporter;    
}
