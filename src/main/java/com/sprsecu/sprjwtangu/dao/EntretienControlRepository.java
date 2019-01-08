package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.EntretienControl;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface EntretienControlRepository extends JpaRepository<EntretienControl, Long>{
    public EntretienControl findByIdCamion(Long idCamion);
}
