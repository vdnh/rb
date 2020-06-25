/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Repere;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author admin
 */
public interface RepereRepository extends JpaRepository<Repere, Long>{
    public List<Repere> findByIdTransporter(Long idTransporter);
    public List<Repere> findByIdEntreprise(Long idEntreprise);
}
