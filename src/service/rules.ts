import File from "./file";

export default class Rule {
  //不相连班次
  static async getNoLink() {
    if (process.env.NODE_ENV === "development") {
      return [{ last: "D", now: "B" }];
    }
    const content = await File._readFile("./no-link.json", "[]");
    const data = JSON.parse(content?.data || "[]");
    return data;
  }

  static async setNoLink(rules: Array<any>) {
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
    if (process.env.NODE_ENV === "development") {
      return 8;
    }
    const content = await File._readFile("./rest.txt", "8");
    const data = parseInt(content?.data || "8");
    return data;
  }

  static async setRest(day: number) {
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile("./rest.txt", day.toString());
    return result;
  }

  //不连续上班天数
  static async getMaxConsecutiveDays() {
    const content = await File._readFile("./continus.txt", "8");
    const data = content?.data || 8;
    return data;
  }
}
