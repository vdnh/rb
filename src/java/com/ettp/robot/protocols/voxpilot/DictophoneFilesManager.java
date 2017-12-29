package com.ettp.robot.protocols.voxpilot;

import com.ettp.robot.common.RobotSession;
import com.ettp.robot.common.Constants;
import com.ettp.robot.common.tools.SessionLog;

import com.ettp.ejb.robot.sessionManager.SessionManagerBeanRemote;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import java.sql.Timestamp;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;


public class DictophoneFilesManager {
  public static final String ORIG_DIR = Constants.RECORD_DIR + File.separator + "DICTOPHONE" + File.separator + "orig" +
    File.separator;
  public static final String TMP_DIR = Constants.RECORD_DIR + File.separator + "DICTOPHONE" + File.separator + "tmp" +
    File.separator;
  public static final String ORIG_SUFFIX = "_orig";
  public static final String WORK_SUFFIX = "_work";
  public static final String WAV_EXT = ".wav";
  private String sessionId;

  //private SessionManager sessionManager;
  private RobotSession robotSession;
  private boolean isNew = true;

  public DictophoneFilesManager(String sessionId) {
    this.sessionId = sessionId;
    robotSession = ((RobotSession) RobotVxml.robotSessionS.get(sessionId));
  }

  public float initFiles(Long logId) {
    File origFile = new File(ORIG_DIR + sessionId + ORIG_SUFFIX + WAV_EXT);
    File workFile = new File(TMP_DIR + sessionId + WORK_SUFFIX + WAV_EXT);

    if (!origFile.exists()) {
      isNew = true;

      try {
        byte[] data;

        if (logId.longValue() == -1) {
          ByteArrayInputStream bais = new ByteArrayInputStream(new byte[0]);
          AudioFormat af = new AudioFormat(AudioFormat.Encoding.ULAW, 8000, 8, 1, 1, 8000, false);

          AudioInputStream newAIS = new AudioInputStream(bais, af, 0);

          ByteArrayOutputStream out = new ByteArrayOutputStream();

          AudioSystem.write(newAIS, AudioFileFormat.Type.WAVE, out);

          data = out.toByteArray();
        }
        else {
          data = robotSession.getRecordingBlobData(logId);
        }

        FileOutputStream fos = new FileOutputStream(origFile);
        fos.write(data);
        fos.flush();
        fos.close();
        fos = new FileOutputStream(workFile);
        fos.write(data);
        fos.flush();
        fos.close();
      }
      catch (Exception ex) {
        robotSession.sessionLog.log(SessionLog.SEVERE, ex);
      }
    }
    else {
      isNew = false;
    }

    return getFileLength();
  }

  private float getFileLength() {
    File workFile = new File(TMP_DIR + sessionId + WORK_SUFFIX + WAV_EXT);

    try {
      AudioInputStream currentSound = AudioSystem.getAudioInputStream(workFile);
      long frameLength = currentSound.getFrameLength();
      float frameRate = currentSound.getFormat().getFrameRate();
      int frameSize = currentSound.getFormat().getFrameSize();
      float length = ((float) frameLength / frameRate / (float) frameSize) * (float) 1000;
      System.out.println("\t\t" + length);

      return length;
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);

      return 0;
    }
  }

  public void setOriginalBlob(Long logId) {
    File origFile = new File(ORIG_DIR + sessionId + ORIG_SUFFIX + WAV_EXT);
    File workFile = new File(TMP_DIR + sessionId + WORK_SUFFIX + WAV_EXT);

    try {
      FileInputStream fis = new FileInputStream(origFile);
      byte[] data = new byte[fis.available()];
      fis.read(data);

      if (logId.longValue() == -1) {
        robotSession.addRecording(data, new Double(0), "DICTOPHONE", new Timestamp(System.currentTimeMillis()));
      }
      else {
        robotSession.setRecordingBlobData(logId, data, new Double(0), "DICTOPHONE",
          new Timestamp(System.currentTimeMillis()));
      }

      fis.close();

      //remove files
      origFile.delete();
      workFile.delete();
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);
    }
  }

  public void setNewBlob(Long logId) {
    File origFile = new File(ORIG_DIR + sessionId + ORIG_SUFFIX + WAV_EXT);
    File workFile = new File(TMP_DIR + sessionId + WORK_SUFFIX + WAV_EXT);

    try {
      FileInputStream fis = new FileInputStream(workFile);
      byte[] data = new byte[fis.available()];
      fis.read(data);

      if (logId.longValue() == -1) {
        robotSession.addRecording(data, new Double(0), "DICTOPHONE", new Timestamp(System.currentTimeMillis()));
      }
      else {
        robotSession.setRecordingBlobData(logId, data, new Double(0), "DICTOPHONE",
          new Timestamp(System.currentTimeMillis()));
      }

      fis.close();

      //remove files
      System.out.println("remove : " + origFile);
      origFile.delete();
      System.out.println("removed : " + origFile.exists());
      System.out.println("remove : " + workFile);
      workFile.delete();
      System.out.println("removed : " + workFile.exists());
    }
    catch (Exception ex) {
      robotSession.sessionLog.log(SessionLog.SEVERE, ex);
    }
  }

  public void concatWavFiles(byte[] newFile, double offset) {
    File recordFileDir = new File(TMP_DIR);

    if (!recordFileDir.exists()) {
      recordFileDir.mkdirs();
    }

    try {
      AudioInputStream currentSound;
      File workFile = new File(TMP_DIR + sessionId + WORK_SUFFIX + WAV_EXT);
      currentSound = AudioSystem.getAudioInputStream(workFile);
      System.out.println(workFile);

      //AudioFormat.Encoding encoding, float sampleRate, int sampleSizeInBits, int channels, int frameSize, float frameRate, boolean bigEndian
      System.out.println(currentSound.getFormat().getEncoding());
      System.out.println(currentSound.getFormat().getSampleRate());
      System.out.println(currentSound.getFormat().getSampleSizeInBits());
      System.out.println(currentSound.getFormat().getChannels());
      System.out.println(currentSound.getFormat().getFrameSize());
      System.out.println(currentSound.getFormat().getFrameRate());
      System.out.println(currentSound.getFormat().isBigEndian());

      System.out.println(currentSound.available());
      System.out.println(currentSound.getFrameLength());

      byte[] origData = new byte[currentSound.available()];
      currentSound.read(origData);

      int offsetIndex = (int) ((offset * currentSound.getFormat().getFrameRate() * currentSound.getFormat()
                                                                                               .getFrameSize()) / 1000);
      System.out.println("offsetIndex : " + offsetIndex);

      if (offsetIndex > origData.length) {
        offsetIndex = origData.length;
      }

      ByteArrayInputStream bais = new ByteArrayInputStream(newFile);
      System.out.println("newFile : " + newFile.length);

      AudioInputStream newAIS = new AudioInputStream(bais, currentSound.getFormat(), newFile.length / 1);

      byte[] newFileData = new byte[newAIS.available()];
      newAIS.read(newFileData);
      System.out.println("newFileData : " + newFileData.length);

      byte[] newData = new byte[offsetIndex + newFileData.length];

      for (int j = 0; j < offsetIndex; j++) {
        newData[j] = origData[j];
      }

      for (int j = offsetIndex; j < (newData.length); j++) {
        newData[j] = newFileData[j - offsetIndex];
      }

      System.out.print("saving : " + newData.length);

      /*ByteArrayOutputStream out = new ByteArrayOutputStream();
      out.write(newData);

      try {
        out.flush();
        out.close();
      }
       catch (IOException ex) {
        sessionLog.log(SessionLog.SEVERE, ex);
      }

      byte[] audioBytes = out.toByteArray();
      System.out.print("writing : " + audioBytes.length);*/
      bais = new ByteArrayInputStream(newData);

      AudioInputStream workAIS = new AudioInputStream(bais, newAIS.getFormat(), newData.length / 1);
      AudioSystem.write(workAIS, AudioFileFormat.Type.WAVE, workFile);

      //}
    }
    catch (Exception e) {
      robotSession.sessionLog.log(SessionLog.SEVERE, e);
    }
  }

  /*public Long newRecordingLog() {
    try {
      ByteArrayInputStream bais = new ByteArrayInputStream(new byte[0]);

      AudioFormat af = new AudioFormat(AudioFormat.Encoding.ULAW, 8000, 8, 1, 1, 8000, false);

      AudioInputStream newAIS = new AudioInputStream(bais, af, 0);

      ByteArrayOutputStream out = new ByteArrayOutputStream();

      AudioSystem.write(newAIS, AudioFileFormat.Type.WAVE, out);

      byte[] data = out.toByteArray();
      robotSession.sessionLog.log(SessionLog.FINEST, "saving header : " + data.length);

      Long recordingLogId = robotSession.addRecording(data, new Double(0), "DICTOPHONE",
          new Timestamp(System.currentTimeMillis()));

      robotSession.sessionLog.log(SessionLog.FINEST, "Blob saved : " + recordingLogId);

      return recordingLogId;
    }
    catch (Exception e) {
      robotSession.sessionLog.log(SessionLog.SEVERE, e);

      return new Long(0);
    }
  }*/
  public boolean isNew() {
    return isNew;
  }
}
