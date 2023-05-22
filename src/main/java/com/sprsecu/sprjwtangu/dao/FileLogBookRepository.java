/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FileLogBook;
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
public interface FileLogBookRepository extends JpaRepository<FileLogBook, Long>{
    @Query("select f from FileLogBook f where f.idOwner = :x")
    public List<FileLogBook> fileLogBookOwner(@Param("x") Long idOwner);    
    
    @Query("select f from FileLogBook f where f.idOwner = :x and f.dateLogText like :y")
    public List<FileLogBook> fileLogBookOfOwnerByDate(@Param("x") Long idOwner, @Param("y") String dateFindText);

    @Query("select f from FileLogBook f where f.idOwner = :x order by f.dateLog desc")
    public Page<FileLogBook> chercherFileLogBookByOwner(@Param("x") Long idOwner, Pageable pageable);   
}
