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
public class FileInspect implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    private String dateDoneText; // date in text
    @Temporal(TemporalType.DATE)
    private Date dateDone;
    private String dateExpirationText; // dateExpiration in text
    @Temporal(TemporalType.DATE)
    private Date dateExpiration;
    private String name;
    private String type;    
    private String urlData;
    private String note;
}
