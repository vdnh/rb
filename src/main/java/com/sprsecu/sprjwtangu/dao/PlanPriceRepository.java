package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.PlanPrice;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface PlanPriceRepository extends JpaRepository<PlanPrice, Long> {
    
}
