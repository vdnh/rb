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
public class Contact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_contact;
    private String nom;
    private String prenom;
    private String fonction;
    private String email;
    private String tel;
    private String fax;
    // to find the shipper
    private Long id_shipper;
}
