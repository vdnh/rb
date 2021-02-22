package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
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

public class PlanOrder implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idTransporter;
    @Temporal(TemporalType.DATE)
    private Date dateOrder = Date.from(Instant.now());
    @Temporal(TemporalType.DATE)
    private Date dateEnding;
    @Temporal(TemporalType.DATE)
    private Date datePayed;
    private Boolean payed = false;
    private Integer trucks;
    private Integer clientsPros;
    private Integer terminals;
    private String planName;
    private Float price;
    private Float priceBase; // price base principal
    private Integer daysPlan; // days total of plan name
    private String imgUrl=""; // proof pay in image
}
