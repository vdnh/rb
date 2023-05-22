package com.sprsecu.sprjwtangu.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
@Data
@AllArgsConstructor @NoArgsConstructor
public class IsaacFullInfos {
    private String vehicleNo="";
    private String latitude="";
    private String longitude="";
    private String speed="";
    private String readingDateTime="";
    private String course="";
    private String vehicleState="";
    private String odometer="";
    private String driverNo="";
    private String driverName="";
    private String online="";
    private String satelliteActive="";
    private String proximityAddress="";
    private String fromSatellite="";
    private String fuelLevel="";
}
