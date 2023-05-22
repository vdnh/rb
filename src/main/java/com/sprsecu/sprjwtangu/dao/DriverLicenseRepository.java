
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.DriverLicense;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 * * © Nhat Hung VO DINH
 */
public interface DriverLicenseRepository extends JpaRepository<DriverLicense, Long>{
    @Query("select d from DriverLicense d where d.idOwner = :x")
    public List<DriverLicense> driverLicensesOwner(@Param("x") Long idOwner); 
}
