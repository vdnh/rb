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

public class PlanPrice implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private String plan; // : price base principal
    private Long price;
    private String description; // : 3 mois + (10trucks or 10clientspros or 5 terminals)
    private Integer trucks = 10; // : 10
    private Integer clientsPros = 10; // : 10
    private Integer terminals = 5 ; // : 5
}
