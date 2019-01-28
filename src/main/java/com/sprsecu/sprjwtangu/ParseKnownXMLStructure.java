package com.sprsecu.sprjwtangu;

/**
 *
 * @author vdnh
 */
//import java.io.File;
import com.sprsecu.sprjwtangu.entities.UniteInfos;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

public class ParseKnownXMLStructure {
	public static void main(String[] args) throws Exception {
		//Get Docuemnt Builder
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
                  //* 
                  //URL url = new URL("file:///C:/CTS/test/testxml.xml");
                  URL url = new URL("file:///C:/CTS/test/monitoring.cfm.xml");
                  InputStream is = url.openStream();
                  int ptr = 0;
                  StringBuffer buffer = new StringBuffer();
                  while ((ptr = is.read()) != -1) {
                    buffer.append((char)ptr);
                  }
                InputSource inputSource = new InputSource(new StringReader(buffer.toString()));
                Document document = builder.parse(inputSource);  //(buffer.toString()); new File("file:///C:/CTS/test/testxml.xml")
                document.getDocumentElement().normalize();
		 
		//Here comes the root node
		Element root = document.getDocumentElement();
		System.out.println(root.getNodeName());
		//Get all units
		NodeList nList = document.getElementsByTagName("unit");
		System.out.println("============================");
		 
		for (int temp = 0; temp < nList.getLength(); temp++)
		{
		 Node node = nList.item(temp);
		 System.out.println("");    //Just a separator
		 if (node.getNodeType() == Node.ELEMENT_NODE)
		 {
		    //Print each employee's detail
                    UniteInfos ui = new UniteInfos();
		    Element eElement = (Element) node;
		    System.out.println("Unite id : "    + eElement.getElementsByTagName("id").item(0).getTextContent());		    
		    System.out.println("odometer : "   + eElement.getElementsByTagName("odometer").item(0).getTextContent());
                    System.out.println("Latitude : "  + eElement.getElementsByTagName("latitude").item(0).getTextContent());
		    System.out.println("Longtitude : "    + eElement.getElementsByTagName("longitude").item(0).getTextContent());
                    ui.setUnite(eElement.getElementsByTagName("id").item(0).getTextContent());
                    ui.setOdometer(eElement.getElementsByTagName("odometer").item(0).getTextContent());
                    ui.setLatitude(eElement.getElementsByTagName("latitude").item(0).getTextContent());
                    ui.setLongitude(eElement.getElementsByTagName("longitude").item(0).getTextContent());
                     System.out.println("ui data : "+ ui.toString());
                 }
		}	//*/	 		
	}
}
