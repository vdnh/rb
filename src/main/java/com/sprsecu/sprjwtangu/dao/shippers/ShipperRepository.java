package com.sprsecu.sprjwtangu.dao.shippers;

import com.sprsecu.sprjwtangu.entities.shipper.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

/**
 *
 * @author admin
 */
//@RepositoryRestResource
@RestResource
public interface ShipperRepository extends JpaRepository<Shipper, Long>{
    
}
