package com.sprsecu.sprjwtangu.entities;

//import com.sprsecu.sprjwtangu.entities.MachineSpecs.Machine;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author vdnh
 */
public interface MachineSpecsRepository extends JpaRepository<MachineSpecs, Long> {
    @Query("select ms.id, ms.name from MachineSpecs ms where ms.idTransporter = :x")
    public List<Object[]> getAllLightMachines(@Param("x") Long idTransporter);
//    public Map<Long, String> getAllLightMachines();  
}
