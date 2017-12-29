package com.ettp.robot.common;

import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;

//import com.ettp.ejb.robot.sessionManager.SessionManager;
import com.ettp.ejb.robot.sessionManager.SessionManagerBeanRemote;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
/*
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Enumeration;
*/
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import javax.rmi.PortableRemoteObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
//import javax.sql.DataSource;


public class BlobDownloader extends HttpServlet {
  private static final String CONTENT_TYPE = "audio/x-wav";
  private SessionManagerBeanRemote smHome;

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
  }

  public synchronized void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    Long logId;
    DataOutputStream dos = new DataOutputStream(response.getOutputStream());

    //PrintWriter out = response.getWriter();
    String remoteAdresse = request.getRemoteAddr();

    System.out.println("Caller is : " + remoteAdresse);

    if ((remoteAdresse.indexOf(Constants.TOP_HOME_MASK) == 0) ||
        (remoteAdresse.indexOf(Constants.TOP_COMPLETEL_MASK) == 0) ||
        (remoteAdresse.indexOf("127.0.0.1") == 0))
    {
      try {
        response.setContentType(CONTENT_TYPE);
        logId = new Long(request.getParameter("logid"));

        //String sessionId = request.getParameter(Constants.SESSION_ID);
        //if (smHome == null) {
          //smHome = getSessionManagerHome();
        //}

        //SessionManagerBeanRemote sm = smHome.create("BlobDownloader" /*sessionId*/);
        SessionManagerBeanRemote sm = getSessionManagerHome();
        sm.init("BlobDownloader" /*sessionId*/);
        //String sessionId = request.getParameter(Constants.SESSION_ID);
        //SessionManager sm = smHome.create(sessionId);
        /*/ajout de Hung pour tester
        System.out.println("Hung - sm.getCalledNumber():  "+sm.getCalledNumber());
        System.out.println("Hung - sm.getCallerNumber():  "+sm.getCallerNumber());
        System.out.println("Hung - sm.getCallLogId():  "+sm.getCallLogId());
        System.out.println("Hung - sm.getLanguage():  "+sm.getLanguage());
        /*/
        /*
        byte[] data= null;
        //try{
          Context context = new InitialContext();
          DataSource ds = (DataSource) context.lookup("jdbc/robotDS");
          Connection con = ds.getConnection();
          Statement statement = con.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
          String sql= "select * from robot.RECORDING_BLOBS where RECORDING_BLOB_ID =948321916";
                //in "+
                //"(select RECORDING_BLOB_ID from robot.RECORDING_LOG where RECORDING_LOG_ID= "
                //+
                //logId.toString()+")";
          System.out.println("Hung - SQL: "+sql);
          ResultSet resultat = statement.executeQuery(sql);
          if(resultat.next()){
            data= resultat.getBytes("RECORDING");
            statement.close();
            con.close();
            System.out.println("Hung - avoir tire recording");
            //return this;
          }
          else{
            statement.close();
            con.close();
            System.out.println("Hung - ne pas avoir trouve recording");
            //return null;
          }
        //}
        catch(Exception ex) {
          ex.printStackTrace();
          System.out.println("Hung - il y a faute de connexion DB de RecordingBlobs_pl");
          //return null;
        }
         */
        byte[] data = sm.getRecordingBlobData(logId);
        System.out.println("Recover BLOB in " + Constants.CHARSET + "; default charset is : " +
          System.getProperty("file.encoding"));

        //System.out.println("Hung - data.length:  "+data.length);
        String wav = new String(data, Constants.CHARSET);
        dos.write(data);

        //out.print(wav);
        sm.remove();
      }
      catch (Exception e) {
        System.out.println("Hung - BlobDownloader pose de problem:  "+e.getMessage());
        e.printStackTrace();
      }
    }
    else {
      response.setContentType("text/html; charset=windows-1252");

      //out.println("Nice try");
      dos.writeUTF("Nice try");
    }

    //out.close();
    dos.flush();
    dos.close();
  }

  public SessionManagerBeanRemote getSessionManagerHome() throws NamingException {
    Context ctx = new InitialContext();

    return (SessionManagerBeanRemote) ctx.lookup("sessionManager");
  }
}
