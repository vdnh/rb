/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author 
 */
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class Message  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date date = Date.from(Instant.now());
    private Long idSender;
    private String roleSender;
    private Long idReceiver;
    private String roleReceiver;
    private Long idDemande;
    private Long idVoyage;
    private String message;
}
