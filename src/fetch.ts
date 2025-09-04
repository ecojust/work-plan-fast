import Lowdb from "./lowdb";

export default class Fetch {
  static async fetchWorkflow(body: string, method: string = "POST") {
    const url = "https://api.coze.cn/v1/workflow/run";
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer pat_2UTZXjdDSkNFIa6HDBOiD8Rc1NKm3ZCOdW5tE6KPfgtVI3lExV4RAJ8NRQao1UdS",
    };
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  static async calcAllowance(
    startTime: string = "2024.03.11 20:00",
    endTime: string = "2024.03.12 08:00"
  ) {
    const body = JSON.stringify({
      parameters: {
        // input: "2024.03.11 20:00 到 2024.03.12 08:00",
        startTime: startTime,
        endTime: endTime,
      },
      workflow_id: "7480494424796348468",
    });

    const data = await Fetch.fetchWorkflow(body);

    const output = JSON.parse(data.data);

    console.log("output", output);
  }

  static async calcAllowances() {
    const body = JSON.stringify({
      parameters: {
        mode: "items",
        // items: items,
        items: [
          {
            startTime: "2024.03.11 20:00",
            endTime: "2024.03.12 08:00",
            name: "abc",
          },
        ],
      },
      workflow_id: "7480494424796348468",
    });

    const data = await Fetch.fetchWorkflow(body);

    const output = JSON.parse(data.data);

    console.log("output", output);
  }

  static async getHolidays(year: string | number = 2025) {
    const holidays = await Lowdb.getData("holidays.json");

    let thisyear = holidays.find((h: any) => h.year === year);
    if (!thisyear) {
      const response = await fetch(
        `https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      data.days.forEach((d: any) => {
        d.isReal = true;
      });
      const isoff = data.days.filter((d: any) => d.isOffDay);
      holidays.push({
        year: year,
        holidays: isoff,
      });
      await Lowdb.writeFile("holidays.json", JSON.stringify(holidays));
      return isoff;
    }
    return thisyear.holidays;
  }
}
