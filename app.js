import { appendRow, sheets } from "./drivers/sheet.js";

/**
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("Yay! The app was loaded!");

  app.on("issues.opened", async (context) => {
    const { title, number, html_url } = context.payload.issue;

    await appendRow(sheets.sprintPlanningDoc.spreadsheetId, sheets.sprintPlanningDoc.range, [`=HYPERLINK("${html_url}", ${number})`, title]);
  });
};
