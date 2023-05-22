package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.AutreEntretien;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 * * © Nhat Hung VO DINH
 */
public interface AutreEntretienRepository extends JpaRepository<AutreEntretien, Long>{
    public List<AutreEntretien> findByIdCamion(Long idCamion);
}
