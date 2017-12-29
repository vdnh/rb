package com.ettp.robot.protocols.voxpilot;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.tools.DtmfTextVoiceXMLWriter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.*;
import javax.servlet.http.*;


public class DtmfText extends HttpServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setContentType(CONTENT_TYPE);

    String sessionId = request.getParameter(Constants.SESSION_ID);
    SessionLog sessionLog = (SessionLog) RobotVxml.sessionLoggers.get(sessionId);
    sessionLog.log(SessionLog.FINEST, sessionId);

    String callerNumber = request.getParameter(Constants.CALLER_ID);

    //callerNumber = formatCallerNumber(callerNumber);
    //callerNumber = "0660217481";
    sessionLog.log(SessionLog.INFO, "caller = " + callerNumber);

    String calledNumber = request.getParameter(Constants.CALLED_ID);

    //calledNumber = formatCalledNumber(calledNumber);
    sessionLog.log(SessionLog.INFO, "called = " + calledNumber);

    Long serviceDialogId = new Long(request.getParameter(Constants.DIALOG_ID));
    sessionLog.log(SessionLog.INFO, "serviceDialogId = " + serviceDialogId);

    if (serviceDialogId.equals(Constants.EXIT_EVENT_SERVICE_ID)) {
      sessionLog.log(SessionLog.INFO, "User hanged up, closing session");
      closeConnection(sessionLog, sessionId);
    }

    Long dialogOutputId = new Long(request.getParameter(Constants.DIALOG_OUTPUT_ID));
    sessionLog.log(SessionLog.INFO, "dialogOutputId = " + dialogOutputId);

    String languageCode = request.getParameter(Constants.LANGUAGE_CODE);
    sessionLog.log(SessionLog.INFO, "languageCode = " + languageCode);

    PrintWriter out = response.getWriter();

    StringBuffer vxml = new StringBuffer();
    vxml = DtmfTextVoiceXMLWriter.addDtmfText(vxml, callerNumber, calledNumber, serviceDialogId, dialogOutputId,
        languageCode);
    sessionLog.log(SessionLog.FINE, vxml.toString());
    out.println(vxml);
    out.close();
  }

  protected static void closeConnection(SessionLog sessionLog, String sessionId) {
    try {
      sessionLog.log(SessionLog.INFO, "closing session : DTMF_TEXT");
      RobotVxml.closeConnection(sessionLog, sessionId);
    }
    catch (Exception ex) {
      sessionLog.log(SessionLog.SEVERE, ex);
    }
  }
}
