package com.sprsecu.sprjwtangu.entities.shipper;

import javax.persistence.Column;
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
public class Shipper {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_shipper;
    private String nom;
    private String raison_sociale;
    private String depuis;
    private String email;
    private String tel;
    private String fax;
    private Boolean status;
    @Column(unique = true)
    private String username;
    //@JsonIgnore
    private String password;    
}
