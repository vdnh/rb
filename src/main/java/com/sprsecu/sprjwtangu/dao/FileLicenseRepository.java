package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FileLicense;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface FileLicenseRepository extends JpaRepository<FileLicense, Long>{
    @Query("select f from FileLicense f where f.idOwner = :x")
    public List<FileLicense> fileLicenseOwner(@Param("x") Long idOwner);    
}
