package com.ettp.robot.common;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;
import com.ettp.robot.protocols.voxpilot.DictophoneFilesManager;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class FileDownloader extends HttpServlet {
  private static final String CONTENT_TYPE = "audio/x-wav";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    PrintWriter out = response.getWriter();

    String remoteAdresse = request.getRemoteAddr();

    System.out.println("Caller is : " + remoteAdresse);

    if ((remoteAdresse.indexOf(Constants.TOP_HOME_MASK) == 0) ||
        (remoteAdresse.indexOf(Constants.TOP_COMPLETEL_MASK) == 0) || (remoteAdresse.indexOf("127.0.0.1") == 0)) {
      try {
        response.setContentType(CONTENT_TYPE);

        String sessionId = request.getParameter("sessionid");
        FileInputStream workFile = new FileInputStream(DictophoneFilesManager.TMP_DIR + sessionId +
            DictophoneFilesManager.WORK_SUFFIX + DictophoneFilesManager.WAV_EXT);

        byte[] data = new byte[workFile.available()];
        workFile.read(data);
        System.out.println("Tmp wav " + Constants.CHARSET + "; default charset is : " +
          System.getProperty("file.encoding"));

        String wav = new String(data, Constants.CHARSET);
        workFile.close();
        out.print(wav);
      }
      catch (Exception e) {
        e.printStackTrace();
      }
    }
    else {
      response.setContentType("text/html; charset=windows-1252");
      out.println("Nice try");
    }

    out.close();
  }
}
