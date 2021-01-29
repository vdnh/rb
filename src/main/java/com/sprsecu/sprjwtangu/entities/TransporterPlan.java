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
public class TransporterPlan  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String Name; // 3 months, 1 year, 2 years - 95 days, 369 days, 734 days
    private Integer days; // number days for this plan 3 months, 1 year, 2 years - 95 days, 369 days, 734 days
    private Integer trucks;
    private Integer clientsPros;
    private Integer terminals;
    private Float price;
    @Temporal(TemporalType.DATE)
    private Date dateCreated;
    
}
