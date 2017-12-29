package com.ettp.robot.common.tools;

import java.io.File;
import java.io.FileInputStream;

import java.util.Properties;


public class GeneralLog extends Log {
  @Override
  protected synchronized void log(String string) {
    System.out.println(string);
  }
}
