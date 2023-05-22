package com.sprsecu.sprjwtangu.dao;

import com.sprsecu.sprjwtangu.entities.LoadDetail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author vdnh
 */
public interface LoadDetailRepository extends JpaRepository<LoadDetail, Long>{
    public List<LoadDetail> findByIdTransport(Long idTransport);
}
