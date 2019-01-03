package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FichePhysiqueEntretien;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface FichePhysiqueEntretienRepository extends JpaRepository<FichePhysiqueEntretien, Long>{
    public FichePhysiqueEntretien findByIdCamion(Long idCamion);
}

