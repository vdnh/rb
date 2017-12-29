package com.ettp.robot.protocols.voxpilot.tools;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;


public class WavTools {
  public static byte[] cutEnd(byte[] origWav, int bytes) {
    try {
      AudioInputStream currentSound;
      currentSound = AudioSystem.getAudioInputStream(new ByteArrayInputStream(origWav));

      byte[] origData = new byte[currentSound.available()];
      currentSound.read(origData);
      System.out.println("\t\t\torigData.length" + origData.length);

      byte[] newData;

      if (origData.length > 8000) {
        newData = new byte[origData.length - 800];
      }
      else {
        newData = new byte[origData.length];
      }

      System.out.println("\t\t\tnewData.length" + newData.length);

      for (int i = 0; i < newData.length; i++) {
        newData[i] = origData[i];
      }

      ByteArrayInputStream bais = new ByteArrayInputStream(newData);
      ByteArrayOutputStream baos = new ByteArrayOutputStream();

      AudioInputStream workAIS = new AudioInputStream(bais, currentSound.getFormat(), newData.length);
      AudioSystem.write(workAIS, AudioFileFormat.Type.WAVE, baos);

      return baos.toByteArray();

      //}
    }
    catch (Exception e) {
      e.printStackTrace();

      return null;
    }
  }
}
