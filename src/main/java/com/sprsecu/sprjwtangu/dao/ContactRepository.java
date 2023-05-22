package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Contact;
import java.util.List;
import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author vdnh
 * * © Nhat Hung VO DINH
 */
//@RepositoryRestResource
public interface ContactRepository extends JpaRepository<Contact, Long>{
    @Query("select c from Contact c where c.nom like :x")
    public Page<Contact> chercher(@Param("x") String mc, Pageable pageable);
    
    @Query("select c from Contact c where c.id_shipper = :x")
    public List<Contact> contactsDeShipper(@Param("x") Long id_shipper);
    
    @Query("select c from Contact c where c.id_transporter = :x")
    public List<Contact> contactsDeTransporter(@Param("x") Long id_transporter);//    
//    @Query("select c from Contact c where c.id_manager like :x")
//    public List<Contact> contactsDeManager(Long id_shipper);
}
