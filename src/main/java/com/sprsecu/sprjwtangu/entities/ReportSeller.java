package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
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
 * @author vdnh
 */
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class ReportSeller implements Serializable {
    @Id @GeneratedValue
    private Long id;
    private String account; // compte
    private String type;
    private String dateDoneText; // date in text
    @Temporal(TemporalType.DATE)
    private Date dateDone; // date in Date
    private String company; // compagnie
    private String contact;
    private String telephone;
    private String km;
    private String report; // suivi
    private String email;
    private String address;
    private Long idTransporter;
    private Long idSeller; // actual, it's idDispatch of transporter
    private String seller; // actual, it's dispatchs' name of transporter
}
