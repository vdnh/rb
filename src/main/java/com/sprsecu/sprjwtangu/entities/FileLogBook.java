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
public class FileLogBook implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    @Temporal(TemporalType.DATE)
    private Date dateLog;
    private String dateLogText="";
    private String startTime=""; // time start driving
    private String endTime=""; // time end driving
    private String name=""; // name of file 
    private String type="";    // type of file
    private String urlData=""; // data of file
    private String note="";
    private Boolean nextDay=false; // true for endTime in the day after
    private String timeInService; //
}
