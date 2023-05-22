/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.SaleTax;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author admin
 */
public interface SaleTaxRepository extends JpaRepository<SaleTax, Long> {
    @Query("select st from SaleTax st where st.country = :x")
    public List<SaleTax> saleTaxesDeCountry(@Param("x") String country);
    
    @Query("select st from SaleTax st where st.country = :x and st.province = :y")
    public SaleTax saleTaxesDeProvince(@Param("x") String country, @Param("y") String province);//    
}
