package com.sprsecu.sprjwtangu.entities.transporter;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
public class Transporter {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //private String name;
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
    @OneToMany(fetch = FetchType.EAGER)
    private List<Camion> camions = new ArrayList<>();
    
}
