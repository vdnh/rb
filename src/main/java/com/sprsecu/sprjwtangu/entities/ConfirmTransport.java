package com.sprsecu.sprjwtangu.entities;

//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.time.LocalDate;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
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
public class ConfirmTransport  implements Serializable{
    @Id @GeneratedValue
    //@Column(length = 20)
    private Long id;
    // infos of transporter
    @Column(length = 50)
    private String selfName;//
    @Column(length = 50)
    private String selfnid;//="9299-9101"
    @Column(length = 50)
    private String selfnir;//="NIR  R-1091728"
    private String selfAddress;//=""
    @Column(length = 50)
    private String selfVille;//=""
    @Column(length = 20)
    private String selfCodePostal;//=""
    @Column(length = 20)
    private String selfTel;//="450-974-9111"
    @Column(length = 20)
    private Long idTransporter;
//    private String selfContact;//='' // if there are many names, separate with /
    
    // carrier Infos
    @Column(length = 50)
    private String comName;//=''
    @Column(length = 50)
    private String comContact;//=''
    private String comAddress;//=''
    @Column(length = 50)
    private String comVille;//=''
    @Column(length = 20)
    private String comTel;//=''

    // pick inos
    @Temporal(TemporalType.DATE)
    private Date datePick;
    @Column(length = 50)
    private String pickFrom;//=''
    @Column(length = 50)
    private String pickName;//=''
    private String pickAddress;//=''
    @Column(length = 50)
    private String pickVille;//=''
    @Column(length = 20)
    private String pickCodePostal;//=''
    
    // drop infos
    @Temporal(TemporalType.DATE)
    private Date dateDrop;
    @Column(length = 50)
    private String shipTo;//=''
    @Column(length = 50)
    private String shipName;//=''
    private String shipAddress;//=''
    @Column(length = 50)
    private String shipVille;//=''
    @Column(length = 20)
    private String shipCodePostal;//=''

    // self infos of form
    @Column(length = 20)
    private String formNumero;//=''  // this is the last number + 1 , in the table Transporter
    private String formDescription;//=''
    @Column(length = 20)
    private String formMontant;//=''
    private String formPickUp;//=''
    private String formDrop;//=''
    private String formNotes;//=''
    @Column(length = 50)
    private String formContact;//='Marc-André / Steven'// if there are many names, separate with /, express-contact of transporter
    @Column(length = 20)
    private String formTel;//=''
    @Column(length = 50)
    private String formEmail;//=''
}
