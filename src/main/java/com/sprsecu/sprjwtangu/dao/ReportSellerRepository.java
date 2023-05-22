package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.ReportSeller;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author vdnh
 */
public interface ReportSellerRepository extends JpaRepository<ReportSeller, Long>{
    
    public List<ReportSeller> findByIdTransporter(Long idTransporter);
    
    public List<ReportSeller> findByIdSeller(Long idSeller);
}
