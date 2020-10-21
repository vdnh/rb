package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Camion;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface CamionRepository  extends JpaRepository<Camion, Long>{
    @Query("select c from Camion c where c.plaque like :x")
    public Page<Camion> chercherPlaque(@Param("x") String mc, Pageable pageable);    
       
    @Query("select c from Camion c where c.idTransporter = :x")
    public List<Camion> camionsDeTransporter(@Param("x") Long idTransporter);
    
    @Query("select c from Camion c where c.uniteMonitor like :x and c.monitor like :y")
    public Camion camionMonitoring(@Param("x") String uniteMonitor, @Param("y") String monitor);
    
//    @Modifying
    @Query("update Camion c set "
            + "c.speed=:speed, "
            + "c.timeStop=:timeStop, "
            + "c.latitude=:latitude, "
            + "c.longtitude=:longtitude, "
            + "c.location=:location, "
            + "c.direction=:direction, "
            + "c.odometre=:odometre "
            
            + "where c.id = :id")
    public Boolean updateCamionFromTerminal(
            @Param("id")Long id, 
            @Param("speed")Double speed,
            @Param("timeStop")Long timeStop,
            @Param("latitude")Double latitude,
            @Param("longtitude")Double longtitude,
            @Param("location")String location,
            @Param("direction")Double direction,
            @Param("odometre")Long odometre
            /*
            @Param(value = "id")Long id, 
            @Param(value = "speed")Double speed,
            @Param(value = "timeStop")Long timeStop,
            @Param(value = "latitude")Double latitude,
            @Param(value = "longtitude")Double longtitude,
            @Param(value = "location")String location,
            @Param(value = "direction")Double direction,
            @Param(value = "odometre")Long odometre
            */
    );
    /*
    this.truck.id
    this.truck.speed=
    this.truck.timeStop=     
    this.truck.latitude=
    this.truck.longtitude=
    this.truck.location=
    this.truck.direction=
    this.truck.odometre
    */
}
