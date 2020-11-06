/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.LoadFrequent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface LoadFrequentRepository  extends JpaRepository<LoadFrequent, Long>{
    public List<LoadFrequent> findByIdTransporter(Long idTransporter);
    public List<LoadFrequent> findByIdShipper(Long idShipper);
}
