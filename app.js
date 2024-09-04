import {
  appendRow,
  deleteSingleRow,
  getData,
  sheets,
} from "./drivers/sheet.js";

/**
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("Yay! The app was loaded!");

  app.on("issues.opened", async (context) => {
    await addNewIssue(context);
  });

  app.on("issues.reopened", async (context) => {
    await addNewIssue(context);
  });

  app.on("issues.closed", async (context) => {
    await deleteIssue(context);
  });

  app.on("issues.deleted", async (context) => {
    await deleteIssue(context);
  });
};

async function addNewIssue(context) {
  const { title, number, html_url } = context.payload.issue;

  await appendRow(
    sheets.sprintPlanningDoc.spreadsheetId,
    sheets.sprintPlanningDoc.range,
    [`=HYPERLINK("${html_url}", ${number})`, title]
  );
}

async function deleteIssue(context) {
  const { number } = context.payload.issue;
  const sheetIssueColumnValues = await getData(
    sheets.sprintPlanningDoc.spreadsheetId
  );
  console.log("sheetIssueColumnValues", sheetIssueColumnValues);
  const indexToRemove = sheetIssueColumnValues.findIndex(
    (row) => row[0] === number
  );
  console.log("indexToRemove", indexToRemove);
  await deleteSingleRow(sheets.sprintPlanningDoc.spreadsheetId, indexToRemove);
}