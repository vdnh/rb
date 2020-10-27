package com.sprsecu.sprjwtangu.dto;

import com.sprsecu.sprjwtangu.entities.Camion;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
@Data
@AllArgsConstructor @NoArgsConstructor
public class CamionForRoute implements Serializable{
    private Long id;
    private Long odometre;     
    private Double longtitude;
    private Double latitude;
    private Double direction; // 0.00 - 359.99 -- north-east-south-west;    
    private Double speed;
    private Long timeStop; // the time when terminal stopped;  new Date().getTime()
    private String location; // address in AVL
    
    public CamionForRoute(Camion c){
        this.id=c.getId();
        this.odometre=c.getOdometre();     
        this.longtitude=c.getLongtitude();
        this.latitude=c.getLatitude();
        this.direction=c.getDirection();  
        this.speed=c.getSpeed();
        this.timeStop=c.getTimeStop();
        this.location=c.getLocation();
    }
    
    public void transferData(Camion c){
        c.setOdometre(this.odometre);     
        c.setLatitude(this.latitude);
        c.setLongtitude(this.longtitude);
        c.setSpeed(this.speed);
        c.setDirection(this.direction);
        c.setTimeStop(this.timeStop);
        c.setLocation(this.location);
    }
}