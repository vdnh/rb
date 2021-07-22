package com.sprsecu.sprjwtangu.entities;

//import com.sprsecu.sprjwtangu.entities.MachineSpecs.Machine;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author vdnh
 */
public interface MachineSpecsRepository extends JpaRepository<MachineSpecs, Long> {
    @Query("select ms.id, ms.name from MachineSpecs ms")
    public Map<Long, String> getAllLightMachines();  
}
