interface HabiticaUserDataInt {
  auth: {
    local: {
      username: string;
    };
    timestamps: {
      loggedin: string;
      created: string;
      updated: string;
    };
  };
  achievements: {
    streak: number;
    perfect: number;
    quests: {
      [key: string]: number;
    };
  };
  profile: {
    name: string;
    imageURL: string;
  };
  stats: {
    hp: number;
    mp: number;
    exp: number;
    gp: number;
    lvl: number;
    class: string;
    str: number;
    con: number;
    int: number;
    per: number;
    toNextLevel: number;
    maxHealth: number;
    maxMP: number;
  };
}

export interface HabiticaUserInt {
  success: boolean;
  data: HabiticaUserDataInt;
}

export interface AchievementInt {
  title: string;
  text: string;
  icon: string;
  earned: boolean;
  value?: number | boolean;
  index: number;
  optionalCount?: number;
}

interface HabiticaAchievementDataInt {
  basic: {
    label: string;
    achievements: {
      [key: string]: AchievementInt;
    };
  };
  onboarding: {
    label: string;
    achievements: {
      [key: string]: AchievementInt;
    };
  };
  seasonal: {
    label: string;
    achievements: {
      [key: string]: AchievementInt;
    };
  };
  special: {
    label: string;
    achievements: {
      [key: string]: AchievementInt;
    };
  };
}

export interface HabiticaAchievementInt {
  success: boolean;
  data: HabiticaAchievementDataInt;
}
