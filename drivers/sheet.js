import { env } from "node:process";
import { JWT } from "google-auth-library";

const key = JSON.parse(env.GACC);

const serviceAccountAuth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

/** @type import("@googleapis/sheets") */
let gSheetModule;

export async function appendRow(spreadsheetId, range, values) {
    console.log({ s: env["GOOGLE_APPLICATION_CREDENTIALS"] })
    gSheetModule = gSheetModule || await import("@googleapis/sheets").then(m => m);

    const { sheets } = gSheetModule;

    const sheetClient = sheets("v4");

    const result = await sheetClient.spreadsheets.values.append({
        auth: serviceAccountAuth,
        spreadsheetId, range, insertDataOption: "INSERT_ROWS", valueInputOption: "USER_ENTERED", requestBody: {
            "range": "Sheet3",
            "majorDimension": "ROWS",
            "values": [values]
        }
    });

    console.log(result);
}


export const sheets = {
    sprintPlanningDoc: {
        spreadsheetId: "1JF2Ba3Rk8FvYREFLwcOc53Yxlx_DoMCApdUIMwaOIkQ",
        range: "Sync"
    }
}