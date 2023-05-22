package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.BonDeTravail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 * * © Nhat Hung VO DINH
 */
public interface BonDeTravailRepository extends JpaRepository<BonDeTravail, Long>{
    public List<BonDeTravail> findByIdCamion(Long idCamion);
}
