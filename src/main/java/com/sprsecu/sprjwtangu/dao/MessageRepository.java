/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface MessageRepository extends JpaRepository<Message, Long>{
    
    @Query("select m from Message m where m.idReceiver = :x")
    public List<Message> messagesReceived(@Param("x") Long idReceiver);
    
    @Query("select m from Message m where m.idSender = :x")
    public List<Message> messagesSent(@Param("x") Long idSender);
    
    @Query("select m from Message m where m.idSender = :x and m.idDemande = :y")
    public Message messageDemandeContacted(@Param("x") Long idSender, 
            @Param("y") Long idDemande);
    
    @Query("select m from Message m where m.idSender = :x and m.idVoyage = :y")
    public Message messageVoyageContacted(@Param("x") Long idSender, 
            @Param("y") Long idVoyage);
}
