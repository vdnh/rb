package com.sprsecu.sprjwtangu.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
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
public class AppUser  implements Serializable{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    //@JsonIgnore
    private String password;
    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<AppRole> roles = new ArrayList<>();
    // to identify what shipper or what transporter  when we know his role
    private Long idUser;
    private Long idSecond; // to second role
    private String roleSimple; // add for adapte with angular
    private String entrepriseNom; // name of principal entreprise
    private String fullName=""; // full name of user
    @JsonIgnore
    public String getPassword(){
        //System.out.println("AppUser.class -- Here is your password : " + this.password);
        return this.password;
    }
    @JsonSetter
    public void setPassword(String password){
        this.password=password;
    }
    
    private Long idTransporter;  // id de Transporter - besoins dans le cas de dispatch de transporter
    
}
