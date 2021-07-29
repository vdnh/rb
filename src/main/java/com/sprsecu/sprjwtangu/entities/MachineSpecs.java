//package com.sprsecu.sprjwtangu.entities;

/**
 *
 * @author vdnh
 */
//public class MachineSpecs {
//    
//}
package com.sprsecu.sprjwtangu.entities;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author vdnh
 */
@Entity
@Data
@AllArgsConstructor @NoArgsConstructor
public class MachineSpecs  implements Serializable{
    @Id @GeneratedValue
    private Long id;
    private Long idTransporter;
    private String name="";
    private String photo01="";
    private String photo02="";
    private String photo03="";
    private String specs="";
    private String link="";   
    
//    public class Machine{
//        private Long id;
//        private String name="";   
//    }
}

//class Machine{
//    private Long id;
//    private String name="";   
//}