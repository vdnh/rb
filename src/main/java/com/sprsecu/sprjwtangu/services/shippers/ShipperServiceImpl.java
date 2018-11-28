package com.sprsecu.sprjwtangu.services.shippers;

import com.sprsecu.sprjwtangu.dao.shippers.AdresseRepository;
import com.sprsecu.sprjwtangu.dao.shippers.ContactRepository;
import com.sprsecu.sprjwtangu.dao.shippers.ShipperRepository;
import com.sprsecu.sprjwtangu.entities.shipper.Adresse;
import com.sprsecu.sprjwtangu.entities.shipper.Contact;
import com.sprsecu.sprjwtangu.entities.shipper.Shipper;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author admin
 */
@Service
@Transactional
public class ShipperServiceImpl implements ShipperService{
    
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Autowired
    private ShipperRepository shipperRepository;
    
    @Autowired
    private AdresseRepository adresseRepository;
    
    @Autowired
    private ContactRepository contactRepository;

    @Override
    public Shipper saveShipper(Shipper shipper) {
        String hashPW = bCryptPasswordEncoder.encode(shipper.getPassword());
        shipper.setPassword(hashPW);
        return shipperRepository.save(shipper);
    }

    @Override
    public Adresse saveAdresse(Adresse adresse) {
        return adresseRepository.save(adresse);
    }

    @Override
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Shipper findShipperById(Long id) {
        return shipperRepository.findById(id).get();
    }
/*
    @Override
    public Collection<Adresse> findAdresseByShipperId(Long shipperId) {
        return adresseRepository.findByIdShipper(shipperId);
    }

    @Override
    public Collection<Contact> findContactByShipperId(Long shipperId) {
        return contactRepository.findByIdShipper(shipperId);
    }
//*/
    
}
