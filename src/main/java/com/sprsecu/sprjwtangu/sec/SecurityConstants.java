package com.sprsecu.sprjwtangu.sec;

/**
 *
 * @author vdnh
 */
public class SecurityConstants {
    public static final String SECRET = "vdnh@yahoo.com";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final long EXPIRATION_TIME = 240_000; //4 minutes
    //public static final long EXPIRATION_TIME = 864_000_000; //10 days
}
