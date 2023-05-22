/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sprsecu.sprjwtangu;

import com.google.gson.Gson;
import com.sprsecu.sprjwtangu.entities.IsaacFullInfos;
import com.sprsecu.sprjwtangu.entities.UniteInfos;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IsaacSosprestige {

    // one instance, reuse
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .build();
    public String authorization="";
    
    public static void main(String[] args) throws Exception {

        IsaacSosprestige obj = new IsaacSosprestige();
        obj.execPostGet();

//        System.out.println("Testing 2 - Send Http POST request");
//        obj.sendPost();
//        
//        System.out.println("Testing 1 - Send Http GET request");
//        obj.sendGet(obj.authorization);

    }

    public List<UniteInfos> execPostGet() throws Exception {
//        IsaacSosprestige obj = new IsaacSosprestige();

//        System.out.println("Testing 2 - Send Http POST request");
        this.sendPost();
        
//        System.out.println("Testing 1 - Send Http GET request");
        return this.sendGet(this.authorization);
    }
    public List<UniteInfos> sendGet(String authorization) throws Exception {
        /*
        GET https://ct596.isaachosting.ca/isaacapi/api/v1.0/positions
        Request Header
        Content-Type:application/x-www-form-urlencoded
        Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJjbGllbnRfaWQiOiJzb3NwcmVzdGlnZWFwcGI5MzE3NTZmIiwic2NvcGUiOlsiSXNhYWNBcGkiLCJvcGVuaWQiXSwic3ViIjoiNDUyMiIsImFtciI6InBhc3N3b3JkIiwiYXV0aF90aW1lIjoxNjgyNDc3MzMzLCJpZHAiOiJpZHNydiIsImdpdmVuX25hbWUiOiJjdDU5NnNvc3ByZXN0aWdlIiwiQXBpQmFzZVVybCI6Imh0dHBzOi8vY3Q1OTYuaXNhYWNob3N0aW5nLmNhL2lzYWFjYXBpIiwiSXNhYWNBcGlVc2VyU2NvcGVzIjoiUG9zaXRpb25zIEVxdWlwbWVudHMgVmVoaWNsZXMgTWFpbnRlbmFuY2VzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmlzYWFjaG9zdGluZy5jYS9JZGVudGl0eVNlcnZlci9pZGVudGl0eSIsImF1ZCI6Imh0dHBzOi8vYXV0aC5pc2FhY2hvc3RpbmcuY2EvSWRlbnRpdHlTZXJ2ZXIvaWRlbnRpdHkvcmVzb3VyY2VzIiwiZXhwIjoxNjgyNTYzNzMzLCJuYmYiOjE2ODI0NzczMzN9.qKgcJXEa1IbClAttHnGcrtaC2mr9liss-3kc6tjsj_O3TTxccDwcJfwso4Vqh9dKVLQV10H2OpDi1TQFfz6bCcSDHJoUnAxXGKGDt9twtA1FOJ2SOXWGTlQ9M4h1SSB20SfvFHL-zmaLT7UcwCzddtsRNV4Y3riu_Jsd7AnG4gfpLayIP-jHs2UnEmmvkjlthnj1lnyx5zO5aLcXd_LWVk9SUJw4GYdWmRCQ88sVNxxbrpxLhHVTh5DRRuGTrD-YCqWLoQ-Stl5mmAUFKLiiH4jh1uX3SQSLPo97vG6lmP5ymU2A8wY0hQvmq3hz5jbNzK6NgRfTZuxeZNOKbwZEOA
        */
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create("https://ct596.isaachosting.ca/isaacapi/api/v1.0/positions")) //"https://httpbin.org/get"))
                .setHeader("User-Agent", "Java 11 HttpClient Bot")
                .header("Authorization", authorization)
                .build();
                // .header("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJjbGllbnRfaWQiOiJzb3NwcmVzdGlnZWFwcGI5MzE3NTZmIiwic2NvcGUiOlsiSXNhYWNBcGkiLCJvcGVuaWQiXSwic3ViIjoiNDUyMiIsImFtciI6InBhc3N3b3JkIiwiYXV0aF90aW1lIjoxNjgyOTY2NDAzLCJpZHAiOiJpZHNydiIsImdpdmVuX25hbWUiOiJjdDU5NnNvc3ByZXN0aWdlIiwiQXBpQmFzZVVybCI6Imh0dHBzOi8vY3Q1OTYuaXNhYWNob3N0aW5nLmNhL2lzYWFjYXBpIiwiSXNhYWNBcGlVc2VyU2NvcGVzIjoiUG9zaXRpb25zIEVxdWlwbWVudHMgVmVoaWNsZXMgTWFpbnRlbmFuY2VzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmlzYWFjaG9zdGluZy5jYS9JZGVudGl0eVNlcnZlci9pZGVudGl0eSIsImF1ZCI6Imh0dHBzOi8vYXV0aC5pc2FhY2hvc3RpbmcuY2EvSWRlbnRpdHlTZXJ2ZXIvaWRlbnRpdHkvcmVzb3VyY2VzIiwiZXhwIjoxNjgzMDUyODAzLCJuYmYiOjE2ODI5NjY0MDN9.IofM-lD5E3GPW7OcuFDIqoadjQtpnHz8D-9s0QGeK15E9Fm36RFQJcyFAY6a8f_0iDzsj7-wkanMOBmh2ELW7ru1xoGsvhvs6_zTfmPHpKUeJRpI5eVaGpu4j4JULS6L6QCpGLroT9Rmt-dI0F0_Syktt9L5rz5dOPMnhxfxqORB-qXwFXiVFg-ZIeqE9WQiZs3_T3GGL5ue-WvlRzz9xCzXOfmlTVv4Y4HULAFtL2o9nvA_JhZYHl8ZZ4aYDHAXawZPXiMFlFsDNAXvtGtlYLEigOKgwSiWM5Oix-Aq-iZpiwnkZbhdDbxxpuz7Vgh3M2YBY2J9MhMOjZ-X3mkLkQ")

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

//        // print status code
//        System.out.println(response.statusCode());
//
//        // print response body
//        System.out.println(response.body());
        
        //IsaacFullInfos[] isaacFullInfos = gson.fromJson(response.body(), IsaacFullInfos[].class);
        
        //
        String unitsJson = response.body();
        List<UniteInfos> listUniteInfos = new ArrayList<>();
        Gson gson = new Gson();
//        IsaacFullInfos[] units = gson.fromJson(unitsJson, IsaacFullInfos[].class);
//        System.out.println("units lenght = " + units.length);
        try{
            IsaacFullInfos[] units = gson.fromJson(unitsJson, IsaacFullInfos[].class);
            System.out.println("units lenght = " + units.length);
            Arrays.sort(units, (IsaacFullInfos o1, IsaacFullInfos o2) -> {
//                return o1.getVehicleNo().compareToIgnoreCase(o2.getVehicleNo
                int a = Integer.valueOf(o1.getVehicleNo());
                int b = Integer.valueOf(o2.getVehicleNo());
                if(a>b) return 1;
                if(a<b) return -1;
                return 0;
            });
            for(int i = 0; i < units.length; i++) {
//                IsaacFullInfos unitTemp = (IsaacFullInfos)units[i];
//                System.out.println("units"+i +": "+ units[i].getVehicleNo() +" speed: "+units[i].getSpeed() +" odometer: "+units[i].getOdometer());                 
                UniteInfos ui = new UniteInfos();
                ui.setUnite(units[i].getVehicleNo());
                ui.setForeignName(units[i].getVehicleNo() + " " + units[i].getDriverName());  // get name at GPS Supplier
                ui.setOdometer(units[i].getOdometer());
                ui.setLatitude(units[i].getLatitude());
                ui.setLongitude(units[i].getLongitude());
                ui.setDirection(units[i].getCourse());
                ui.setSpeed(units[i].getSpeed());
                ui.setLocation(units[i].getProximityAddress());
//                if(eElement.getElementsByTagName("landmark").item(0)!=null){  // If landmark not null
//                    String[] strs= eElement.getElementsByTagName("landmark").item(0).getTextContent().split("\n"); // split by sign new line \n
//                    ui.setLocalName(strs[1]);
//                }
                listUniteInfos.add(ui);
                System.out.println("ui"+i +": "+ ui.getUnite() +" speed: "+ui.getSpeed() +" odometer: "+ui.getOdometer());                                 
            }
            System.out.println("listUniteInfos size = " + listUniteInfos.size());
//            listUniteInfos.sort((UniteInfos o1, UniteInfos o2) -> {
//                return o1.getUnite().compareToIgnoreCase(o2.getUnite());
//            });
        }
        catch(Exception e){
            e.printStackTrace();
        }
//        try (Reader reader = new FileReader("c:\\projects\\staff.json")) {
//
//            // Convert JSON File to Java Object
//            Staff staff = gson.fromJson(reader, Staff.class);
//			
//			// print staff object
//            System.out.println(staff);
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        //
        return listUniteInfos;
    }

    private void sendPost() throws Exception {
        /*
        POST https://auth.isaachosting.ca/IdentityServer/identity/connect/token
        Request Header
        Content-Type:application/x-www-form-urlencoded
        Authorization:Basic c29zcHJlc3RpZ2VhcHBiOTMxNzU2ZjowMTIxMWRmYw==
        Request Body
        grant_type=password&username=ct596sosprestige&password=nMnljTukKFaF&scope=IsaacApi
        */
        // form parameters
        Map<Object, Object> data = new HashMap<>();
//        data.put("username", "abc");
//        data.put("password", "123");
//        data.put("custom", "secret");
//        data.put("ts", System.currentTimeMillis());
        data.put("grant_type", "password");
        data.put("username", "ct596sosprestige");
        data.put("password", "nMnljTukKFaF");
        data.put("scope", "IsaacApi");
//        HttpRequest request = HttpRequest.newBuilder()
//                .POST(buildFormDataFromMap(data))
//                .uri(URI.create("https://httpbin.org/post"))
//                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
//                .header("Content-Type", "application/x-www-form-urlencoded")
//                .build();
        HttpRequest request = HttpRequest.newBuilder()
                .POST(buildFormDataFromMap(data))
                .uri(URI.create("https://auth.isaachosting.ca/IdentityServer/identity/connect/token"))
                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic c29zcHJlc3RpZ2VhcHBiOTMxNzU2ZjowMTIxMWRmYw==")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        // print status code
        System.out.println(response.statusCode());

        // print response body
        System.out.println(response.body());
        String tempText=response.body();
        String bearer="Bearer ";
        this.authorization = tempText.split("\":\"")[1].split("\",\"")[0];
        this.authorization = bearer.concat(this.authorization);
        System.out.println("this.authorization: " + this.authorization);
        

    }

    private static HttpRequest.BodyPublisher buildFormDataFromMap(Map<Object, Object> data) {
        StringBuilder builder = new StringBuilder();
        for (Map.Entry<Object, Object> entry : data.entrySet()) {
            if (builder.length() > 0) {
                builder.append("&");
            }
            builder.append(URLEncoder.encode(entry.getKey().toString(), StandardCharsets.UTF_8));
            builder.append("=");
            builder.append(URLEncoder.encode(entry.getValue().toString(), StandardCharsets.UTF_8));
        }
        System.out.println(builder.toString());
        return HttpRequest.BodyPublishers.ofString(builder.toString());
    }

}