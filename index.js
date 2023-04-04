import puppeteer from "puppeteer";

const BEARTRACKS = "https://www.beartracks.ualberta.ca";

// Should be a list of class or lab codes
// e.g. ["LEC-B2-18113", "LAB-B2-18113"]
const FILTERS = [];

const rowFilter = (html) =>
  html.includes("Open Seats") &&
  (!FILTERS.length || FILTERS.some((filter) => html.includes(filter)));

const TIMEOUT_IN_MS = 10 * 1000; // 10 seconds

puppeteer
  .connect({
    browserURL: "http://localhost:9222",
    defaultViewport: null,
  })
  .then(async (browser) => {
    const pages = await browser.pages();

    const page = pages.find((page) => page.url().startsWith(BEARTRACKS));

    if (!page) {
      throw new Error("No Beartracks page found");
    }

    while (true) {
      console.log("Looking for open seats...");

      const rows = await page.$$("tr");

      const validRow = await Promise.all(
        rows.map(async (row) =>
          rowFilter(await row.evaluate((el) => el.innerHTML))
        )
      ).then((res) => rows.find((_, i) => res[i]));

      if (!validRow) {
        console.log(
          `No open seats found, retrying in ${TIMEOUT_IN_MS / 1000} seconds...`
        );

        await new Promise((resolve) => setTimeout(resolve, TIMEOUT_IN_MS));
        await page.reload();
        continue;
      }

      const anchors = await validRow.$$("a");

      for (const anchor of anchors) {
        if (await anchor.evaluate((el) => el.innerText === "Enroll")) {
          await anchor.click();

          await page.waitForNavigation({ waitUntil: "networkidle0" });

          const anchors = await page.$$("a");

          for (const anchor of anchors) {
            if (await anchor.evaluate((el) => el.innerText === "Submit")) {
              await anchor.click();

              console.log("Enrolled! :D");

              return;
            }
          }
        }
      }
    }
  });
