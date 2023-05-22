package com.sprsecu.sprjwtangu.sec;

/**
 *
 * @author vdnh
 */
public class SecurityConstants {
    public static final String SECRET = "vdnh@yahoo.com";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    //public static final long EXPIRATION_TIME = 2_400_000; //40 minutes
    //public static final long EXPIRATION_TIME = 864_000_000; //10 days
    public static final long EXPIRATION_TIME = 86_400_000; //1 days
}
