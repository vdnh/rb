package com.sprsecu.sprjwtangu.dao.shippers;

import com.sprsecu.sprjwtangu.entities.shipper.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author admin
 */
@RepositoryRestResource
public interface ContactRepository extends JpaRepository<Contact, Long>{
    //public List<Contact> findBy_id_shipper(Long shipperId);
}
