package com.ettp.robot.common;

import com.ettp.ejb.robot.sessionManager.SessionManagerBeanRemote;
//import com.ettp.ejb.robot.sessionManager.SessionManagerHome;

import java.io.DataOutputStream;
import java.io.IOException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;




public class BlobDownloaderDirect extends HttpServlet {
  private static final String CONTENT_TYPE = "audio/x-wav";
  private SessionManagerBeanRemote smHome;

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public synchronized void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    Long blobId;
    DataOutputStream dos = new DataOutputStream(response.getOutputStream());

    String remoteAdresse = request.getRemoteAddr();

    if ((remoteAdresse.indexOf(Constants.TOP_HOME_MASK) == 0) ||
        (remoteAdresse.indexOf(Constants.TOP_COMPLETEL_MASK) == 0) ||
        (remoteAdresse.indexOf("127.0.0.1") == 0))
    {
      try {
        response.setContentType(CONTENT_TYPE);
        blobId = new Long(request.getParameter("blobid"));
          //smHome = getSessionManagerHome();
        SessionManagerBeanRemote sm = getSessionManagerHome();
        sm.init("BlobDownloaderDirect");
        byte[] data = sm.getRecordingBlobDataDirect(blobId);
        //System.out.println("Recover BLOB in " + Constants.CHARSET + "; default charset is : " +
          //System.getProperty("file.encoding"));

        String wav = new String(data, Constants.CHARSET);
        dos.write(data);
        sm.remove();
      }
      catch (Exception e) {
        System.out.println("Hung - BlobDownloaderDirect pose de problem:  "+e.getMessage());
        e.printStackTrace();
      }
    }
    else {
      response.setContentType("text/html; charset=windows-1252");
      dos.writeUTF("Nice try");
    }
    dos.flush();
    dos.close();
  }

  public SessionManagerBeanRemote getSessionManagerHome() throws NamingException {
    Context ctx = new InitialContext();

    return (SessionManagerBeanRemote) ctx.lookup("sessionManager");
  }
}
