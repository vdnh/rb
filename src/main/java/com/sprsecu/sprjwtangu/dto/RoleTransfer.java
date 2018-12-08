package com.sprsecu.sprjwtangu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author admin
 */
@Data
@AllArgsConstructor @NoArgsConstructor
public class RoleTransfer {
    private String username;
    private String role;
    
}
