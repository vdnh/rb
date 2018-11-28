package com.sprsecu.sprjwtangu.services.shippers;

import com.sprsecu.sprjwtangu.entities.shipper.Adresse;
import com.sprsecu.sprjwtangu.entities.shipper.Contact;
import com.sprsecu.sprjwtangu.entities.shipper.Shipper;
import java.util.Collection;

/**
 *
 * @author admin
 */
public interface ShipperService {
    public Shipper saveShipper(Shipper shipper);
    public Adresse saveAdresse(Adresse adresse);
    public Contact saveContact(Contact contact);
    //public void addRoleToUser(String username, String roleName);
    public Shipper findShipperById(Long id);
    /*
    public Collection<Adresse> findAdresseByShipperId(Long shipperId);
    public Collection<Contact> findContactByShipperId(Long shipperId);
    //*/
}
