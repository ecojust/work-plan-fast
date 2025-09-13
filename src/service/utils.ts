export default class Util {
  static async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
