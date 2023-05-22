package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.Reparation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface ReparationRepository extends JpaRepository<Reparation, Long>{
    public List<Reparation> findByIdBon(Long idBon);
}
