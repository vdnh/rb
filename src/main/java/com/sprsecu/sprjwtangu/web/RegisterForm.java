package com.sprsecu.sprjwtangu.web;

import lombok.Data;

/**
 *
 * @author vdnh
 */
@Data
public class RegisterForm {
    private String username;
    private String password;
    private String repassword;
}
