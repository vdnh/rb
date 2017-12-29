package com.ettp.robot.protocols.voxpilot;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.GeneralLog;
import com.ettp.robot.protocols.voxpilot.tools.RobotVoiceXMLWriter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class RobotInit extends HttpServlet {
  private static final String CONTENT_TYPE = "text/xml; charset=windows-1252";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setContentType(CONTENT_TYPE);

    GeneralLog generalLog = new GeneralLog();
    System.out.println("\n");
    generalLog.log(GeneralLog.INFO, "<<<<< ROBOT-VERSION-JDBC >>>>>");
    generalLog.log(GeneralLog.INFO, "<<<<< ROBOT VXML CALLED >>>>>");
    Constants.init(generalLog);
    generalLog.log(GeneralLog.FINEST, Constants.ROOT_URL);

    PrintWriter out = response.getWriter();
    StringBuffer vxml = new StringBuffer("");
    vxml = RobotVoiceXMLWriter.addHeader(vxml);
    vxml = RobotVoiceXMLWriter.addInitSubmit(vxml);

    vxml = RobotVoiceXMLWriter.addFooter(vxml);
    generalLog.log(GeneralLog.FINE, vxml.toString());
    out.println(vxml);
    out.close();
  }
}
