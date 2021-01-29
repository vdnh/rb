package com.sprsecu.sprjwtangu.dao;

import java.util.List;
import com.sprsecu.sprjwtangu.entities.PlanOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
/**
 *
 * @author vdnh
 */
public interface PlanOrderRepository extends JpaRepository<PlanOrder, Long>{
    public List<PlanOrder> findByIdTransporter (Long idTransporte);
}
