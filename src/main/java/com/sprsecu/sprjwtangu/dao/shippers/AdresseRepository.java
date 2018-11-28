package com.sprsecu.sprjwtangu.dao.shippers;

import com.sprsecu.sprjwtangu.entities.shipper.Adresse;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author admin
 */
@RepositoryRestResource
public interface AdresseRepository extends JpaRepository<Adresse, Long>{
    //public Collection<Adresse> findByIdShipper(Long shipperId);
}
