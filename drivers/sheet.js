import { env } from "node:process";
import { JWT } from "google-auth-library";
import { sheets as gSheet } from "@googleapis/sheets";

const gacc = env.GACC;

if(!gacc || typeof gacc !== "string") throw new Error("No/Invalid GACC:("+typeof gacc+")-length:"+gacc.length);

const key = JSON.parse(env.GACC);

const serviceAccountAuth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

export async function appendRow(spreadsheetId, range, values) {
    console.log({ s: env["GOOGLE_APPLICATION_CREDENTIALS"] })

    const sheetClient = gSheet("v4");

    const result = await sheetClient.spreadsheets.values.append({
        auth: serviceAccountAuth,
        spreadsheetId, range, insertDataOption: "INSERT_ROWS", valueInputOption: "USER_ENTERED", requestBody: {
            "range": range,
            "majorDimension": "ROWS",
            "values": [values]
        }
    });

    if(result.status.toString().startsWith("2")) {
        console.log(result);
        return;
    }


    console.error("something is not correct", result);
    throw new Error("failed");
}


export const sheets = {
    sprintPlanningDoc: {
        spreadsheetId: "1JF2Ba3Rk8FvYREFLwcOc53Yxlx_DoMCApdUIMwaOIkQ",
        range: "Sync"
    }
}