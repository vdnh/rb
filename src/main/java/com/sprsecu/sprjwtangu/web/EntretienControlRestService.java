package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.EntretienControlRepository;
import com.sprsecu.sprjwtangu.entities.EntretienControl;
import com.sprsecu.sprjwtangu.entities.MessagesConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 */
@RestController
@CrossOrigin("*")
public class EntretienControlRestService {
    @Autowired
    EntretienControlRepository entretienControlRepository;
    
    @RequestMapping(value = "/checkEntretien", method = RequestMethod.GET)
    public EntretienControl getEntretien(){
        EntretienControl entretien = new EntretienControl();
        Long odoActual = 100000l;
        Long odo=0l;
        entretien.setOdo1Fait(odo);
        entretien.setOdo2Fait(odo);
        entretien.setOdo3Fait(odo);
        entretien.setOdo4Fait(odo);
        entretien.setOdo5Fait(odo);
        entretien.setOdo6Fait(odo);
        entretien.setOdo7Fait(odo);
        entretien.setOdo8Fait(odo);        
        // check Ent1
        if((odoActual-entretien.getOdo1Fait())>=20000l)
            System.out.println(MessagesConstants.ent1);
        if((odoActual-entretien.getOdo1Fait())>=45000l)
            System.out.println(MessagesConstants.ent2);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent3);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent4);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent5);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent6);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent7);
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            System.out.println(MessagesConstants.ent8);
        return entretien;
    }
    
    @RequestMapping(value = "/checkEntretien/{id}", method = RequestMethod.GET)
    public EntretienControl getTasksByOdo(@PathVariable Long id){
        StringBuilder sb = new StringBuilder("");
        EntretienControl entretien = new EntretienControl();
        Long odoActual = id;
        Long odo=22000l;
        entretien.setOdo1Fait(odo);
        entretien.setOdo2Fait(odo);
        entretien.setOdo3Fait(odo);
        entretien.setOdo4Fait(odo);
        entretien.setOdo5Fait(odo);
        entretien.setOdo6Fait(odo);
        entretien.setOdo7Fait(odo);
        entretien.setOdo8Fait(odo);        
        // check Ent1
        
        if((odoActual-entretien.getOdo1Fait())>=20000l)
            //System.out.println(MessagesConstants.ent1);
            sb.append(MessagesConstants.ent1).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=45000l)
            //System.out.println(MessagesConstants.ent2);
            sb.append(MessagesConstants.ent2).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent3);
            sb.append(MessagesConstants.ent3).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent4);
            sb.append(MessagesConstants.ent4).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent5);
            sb.append(MessagesConstants.ent5).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent6);
            sb.append(MessagesConstants.ent6).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent7);
            sb.append(MessagesConstants.ent7).append("\n");
        if((odoActual-entretien.getOdo1Fait())>=100000l)
            //System.out.println(MessagesConstants.ent8);       
            sb.append(MessagesConstants.ent8).append("\n");
        System.out.println(sb.toString());
        return entretien;
    }
}
