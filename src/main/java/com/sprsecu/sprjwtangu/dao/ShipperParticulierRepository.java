package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ShipperParticulier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface ShipperParticulierRepository  extends JpaRepository<ShipperParticulier, Long>{
    @Query("select s from ShipperParticulier s where s.nom like :x")
    public Page<ShipperParticulier> chercher(@Param("x") String mc, Pageable pageable);   
    
    //@Query("select s from Shipper s where s.login_name like :x")
    //public Shipper findByLoginName(@Param("x") String login_name);
    public ShipperParticulier findByLoginName(String loginName);
    //public AppUser findByUsername(String username);    
    //public Shipper findByEmail(String email);    
    //email
    
}
