package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ServicesOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface ServicesOfferRepository extends JpaRepository<ServicesOffer, Long>{
    @Query("select s from ServicesOffer s where s.id_transporter = :x")
    public ServicesOffer servicesOfferDeTransporter(@Param("x") Long id_transporter);
}
