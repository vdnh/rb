package com.ettp.robot.protocols.voxpilot;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.tools.DtmfTextVoiceXMLWriter;

import java.io.IOException;
import java.io.PrintWriter;

import java.util.Hashtable;

import javax.servlet.*;
import javax.servlet.http.*;


public class DtmfTextValidate extends HttpServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";
  Hashtable alpha;

  public void init(ServletConfig config) throws ServletException {
    super.init(config);

    alpha = new Hashtable();
    alpha.put("01", " ");
    alpha.put("02", "-");
    alpha.put("21", "A");
    alpha.put("22", "B");
    alpha.put("23", "C");
    alpha.put("31", "D");
    alpha.put("32", "E");
    alpha.put("33", "F");
    alpha.put("41", "G");
    alpha.put("42", "H");
    alpha.put("43", "I");
    alpha.put("51", "J");
    alpha.put("52", "K");
    alpha.put("53", "L");
    alpha.put("61", "M");
    alpha.put("62", "N");
    alpha.put("63", "O");
    alpha.put("71", "P");
    alpha.put("72", "Q");
    alpha.put("73", "R");
    alpha.put("74", "S");
    alpha.put("81", "T");
    alpha.put("82", "U");
    alpha.put("83", "V");
    alpha.put("91", "W");
    alpha.put("92", "X");
    alpha.put("93", "Y");
    alpha.put("94", "Z");
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
    String input = request.getParameter(Constants.INPUT);
    sessionLog.log(SessionLog.INFO, "\t\tMWMWMWMWMW : dtmf = " + input);

    StringBuffer vxml = new StringBuffer();
    vxml = DtmfTextVoiceXMLWriter.addDtmfTextValidate(vxml, callerNumber, calledNumber, serviceDialogId,
        dialogOutputId, getTextFromDtmf(sessionLog, input), getLetters(input), languageCode);
    sessionLog.log(SessionLog.FINE, vxml.toString());
    out.println(vxml);
    out.close();
  }

  private String getTextFromDtmf(SessionLog sessionLog, String input) {
    StringBuffer text = new StringBuffer();

    for (int i = 0; i < (input.length() / 12); i++) {
      StringBuffer letter = new StringBuffer();
      letter.append(input.charAt(5 + (12 * i)));
      letter.append(input.charAt(11 + (12 * i)));
      System.out.println("get : " + letter);

      String letterFromDico = "";

      try {
        letterFromDico = (String) alpha.get(letter.toString());

        if (letterFromDico == null) {
          letterFromDico = "";
        }
      }
      catch (Exception ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
      }

      text.append(letterFromDico);
    }

    return text.toString();
  }

  private String[] getLetters(String input) {
    String[] letters = new String[input.length() / 12];

    for (int i = 0; i < (input.length() / 12); i++) {
      String letter = input.substring(i * 12, (i * 12) + 12);
      System.out.println("letter : " + letter);
      letters[i] = letter;
    }

    return letters;
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
