package com.sprsecu.sprjwtangu.entities.shipper;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
public class Adresse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_adresse;
    private String num;
    private String rue;
    private String code_postal;
    private String ville;
    private String province;
    private String pays;
    private Boolean principal;
    // to know what shipper 
    private Long id_shipper;
}
