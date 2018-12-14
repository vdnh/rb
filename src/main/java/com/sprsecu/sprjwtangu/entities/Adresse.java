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
public class Adresse implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String num;
    private String rue;
    private String code_postal;
    private String ville;
    private String province;
    private String pays;
    private boolean principal;
    private Long id_shipper;
    private Long id_transporter;
    private Long id_manager;
}