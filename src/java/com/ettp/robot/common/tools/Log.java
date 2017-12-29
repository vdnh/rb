package com.ettp.robot.common.tools;

public abstract class Log {
  public static final int SEVERE = 10;
  public static final int WARNING = 7;
  public static final int INFO = 5;
  public static final int FINE = 3;
  public static final int FINEST = 0;
  protected static int CURENT_LEVEL = FINEST;

  public static void setLevel(int level) {
    CURENT_LEVEL = level;
  }

  public void log(int level, String msg) {
    String levelName = getLevelName(level);
    log(levelName + " : " + msg);
  }

  public void log(int level, Exception ex) {
    String levelName = getLevelName(level);
    log(levelName + " : " + ex.getMessage());

    for (int i = 0; i < ex.getStackTrace().length; i++) {
      log("\t" + ex.getStackTrace()[i]);
    }
  }

  private String getLevelName(int level) {
    String levelName = "INFO";

    if (level >= CURENT_LEVEL) {
      switch (level) {
      case SEVERE:
        levelName = "SEVERE";

        break;

      case INFO:
        levelName = "INFO";

        break;

      case FINE:
        levelName = "FINE";

        break;

      case FINEST:
        levelName = "FINEST";

        break;
      }
    }

    return levelName;
  }

  protected abstract void log(String string);
}
