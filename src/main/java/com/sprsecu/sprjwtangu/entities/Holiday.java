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
public class Holiday implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idOwner;
    @Temporal(TemporalType.DATE)
    private Date dateHoliday; // dateHoliday in Date
    private String dateHolidayText; // dateHoliday in text
    private Double rate; // rate for this dateHoliday, alsway >=1
    private String name; // Name of holiday
    private Boolean closed; // use to show open or close

    private String note; // note for anything more
    private String lineMatch; // yyyy-mm-dayOfMonth (ex:2022-06-1)
}
