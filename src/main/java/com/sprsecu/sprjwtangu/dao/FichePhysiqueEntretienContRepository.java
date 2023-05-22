package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.FichePhysiqueEntretienCont;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh 
 */
public interface FichePhysiqueEntretienContRepository extends JpaRepository<FichePhysiqueEntretienCont, Long>{
    public FichePhysiqueEntretienCont findByIdCamion(Long idCamion);
}
