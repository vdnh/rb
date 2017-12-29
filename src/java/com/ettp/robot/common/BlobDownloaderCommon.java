package com.ettp.robot.common;
//import com.ettp.ejb.robot.sessionManager.SessionManager;
//import com.ettp.ejb.robot.sessionManager.SessionManagerHome;
import com.ettp.plsession.CommonBlobs_pl;
import java.io.DataOutputStream;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.PrintWriter;
import java.io.IOException;
//import com.ettp.plsession.CommonBlobs_pl;

public class BlobDownloaderCommon extends HttpServlet
{
  private static final String CONTENT_TYPE = "audio/x-wav";
  private static final String CONTENT_TYPE1 = "audio/mpeg";
  //private SessionManagerHome smHome;

  public void init(ServletConfig config) throws ServletException
  {
    super.init(config);
  }

  public synchronized void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    String blobCode;
    DataOutputStream dos = new DataOutputStream(response.getOutputStream());

    String remoteAdresse = request.getRemoteAddr();

    if ((remoteAdresse.indexOf(Constants.TOP_HOME_MASK) == 0) ||
        (remoteAdresse.indexOf(Constants.TOP_COMPLETEL_MASK) == 0) ||
        (remoteAdresse.indexOf("127.0.0.1") == 0))
    {
      try {
        blobCode = request.getParameter("blobCode");
        if (blobCode.equalsIgnoreCase("HymmeNationalFR")){
          response.setContentType(CONTENT_TYPE1);
        }
        else response.setContentType(CONTENT_TYPE);

        ///*
        CommonBlobs_pl bc= new CommonBlobs_pl();
        bc= bc.findByPrimaryKey(blobCode);
        byte[] data = bc.getRecording();
        //*/
        //*
        //smHome = getSessionManagerHome();
        //SessionManager sm = smHome.create("BlobDownloaderCommon");
        //SessionManager sm = smHome.create();
        /*
        try {
          CommonBlobs_pl bc = bcHome.findByPrimaryKey(blobCode);
          //ejbLog.fine("get Blob data : " + blobCode);
          return bc.getRecording();
        }
        catch (Exception ex) {
          ejbLog.severe(ex);
          return null;
        }
        //*/
        //byte[] data = sm.getRecordingBlobDataCommon(blobCode);

        String wav = new String(data, Constants.CHARSET);
        dos.write(data);
        //* avec smHome
        //sm.remove();
        //*/
      }
      catch (Exception e) {
        System.out.println("Hung - BlobDownloaderCommon pose de problem:  "+e.getMessage());
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
/*
  public SessionManagerHome getSessionManagerHome() throws NamingException {
    Context ctx = new InitialContext();

    return (SessionManagerHome) PortableRemoteObject.narrow(ctx.lookup("SessionManager"), SessionManagerHome.class);
  }
//*/
}