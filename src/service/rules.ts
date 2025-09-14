import File from "./file";

export interface WorkRestConfig {
  workDays: number; // 连续工作天数 m
  restDays: number; // 休息天数 n
}

export const DEFAULT_WORK_REST_CONFIG: WorkRestConfig = {
  workDays: 5,
  restDays: 2,
};

export default class Rule {
  //不相连班次
  static async getNoLink() {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return [{ last: "D", now: "B" }];
    }
    const content = await File._readFile("./no-link.json", "[]");
    const data = JSON.parse(content?.data || "[]");
    return data;
  }

  static async setNoLink(rules: Array<any>) {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile(
      "./no-link.json",
      JSON.stringify(rules, null, 2)
    );
    return result;
  }

  //休息
  static async getRest() {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return 8;
    }
    const content = await File._readFile("./rest.txt", "8");
    const data = parseInt(content?.data || "8");
    return data;
  }

  static async setRest(day: number) {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile("./rest.txt", day.toString());
    return result;
  }

  //不连续上班天数
  static async getMaxConsecutiveDays() {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return 6;
    }
    const content = await File._readFile("./continus.txt", "6");
    const data = content?.data || 6;
    if (typeof data === "number") {
      return data;
    } else {
      return parseInt(data);
    }
  }

  static async setMaxConsecutiveDays(day: number) {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile("./continus.txt", day.toString());
    return result;
  }

  //工作休息配置
  static async getWorkRestConfig(): Promise<WorkRestConfig> {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return DEFAULT_WORK_REST_CONFIG;
    }
    const content = await File._readFile(
      "./work-rest-config.json",
      JSON.stringify(DEFAULT_WORK_REST_CONFIG)
    );
    return JSON.parse(
      content?.data || JSON.stringify(DEFAULT_WORK_REST_CONFIG)
    );
  }

  static async setWorkRestConfig(config: WorkRestConfig) {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile(
      "./work-rest-config.json",
      JSON.stringify(config, null, 2)
    );
    return result;
  }
}
