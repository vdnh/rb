package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FileInspect;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface FileInspectRepository extends JpaRepository<FileInspect, Long>{
    @Query("select f from FileInspect f where f.idOwner = :x")
    public List<FileInspect> fileInspectOwner(@Param("x") Long idOwner);    
}
