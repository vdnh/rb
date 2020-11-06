package com.sprsecu.sprjwtangu.services;

import com.sprsecu.sprjwtangu.entities.AppRole;
import com.sprsecu.sprjwtangu.entities.AppUser;
import java.util.List;

/**
 *
 * @author vdnh
 */
public interface AccountService {
    public AppUser saveUser(AppUser user);
    public AppRole saveRole(AppRole role);
    public void addRoleToUser(String username, String roleName);
    public AppUser findUserByUsername(String username);
    public List<AppUser> getAllUsersByIdUser(Long idUser);
    public List<AppUser> getAllUsersByIdTransporter(Long idTransporter);
    public List<AppUser> getAllUsers();
    public void delUser(AppUser user);
}
