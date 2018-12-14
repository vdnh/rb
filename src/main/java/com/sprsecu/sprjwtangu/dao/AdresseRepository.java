package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Adresse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface AdresseRepository  extends JpaRepository<Adresse, Long>{
    @Query("select a from Adresse a where a.code_postal like :x")
    public Page<Adresse> chercherCodePostal(@Param("x") String mc, Pageable pageable);
    
    @Query("select a from Adresse a where a.id_shipper = :x")
    public List<Adresse> adressesDeShipper(@Param("x") Long id_shipper);
    
    @Query("select a from Adresse a where a.id_transporter = :x")
    public List<Adresse> adressesDeTransporter(@Param("x") Long id_transporter);
//    
//    @Query("select c from Contact c where c.id_manager like :x")
//    public List<Contact> contactsDeManager(Long id_shipper);
}
