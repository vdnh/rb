package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Garantie;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface GarantieRepository extends JpaRepository<Garantie, Long>{
    public List<Garantie> findByIdCamion(Long idCamion);
}
