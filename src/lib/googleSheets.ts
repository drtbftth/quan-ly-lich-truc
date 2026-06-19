import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { Doctor, Department, Schedule } from "./types";
import fallbackData from "../../data/fallback.json";

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const getDoc = async () => {
  if (
    !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
    !process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  ) {
    return null;
  }

  const jwt = new JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, jwt);
  await doc.loadInfo();
  return doc;
};

// --- Readers ---
export async function getDoctors(): Promise<Doctor[]> {
  try {
    const doc = await getDoc();
    if (!doc) return fallbackData.doctors;

    const sheet = doc.sheetsByTitle["Doctors"];
    if (!sheet) return fallbackData.doctors;

    const rows = await sheet.getRows();
    return rows.map((row) => ({
      id: row.get("id"),
      name: row.get("name"),
      department: row.get("department"),
      title: row.get("title"),
    }));
  } catch (error) {
    console.error("Error fetching doctors from Google Sheets:", error);
    return fallbackData.doctors;
  }
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const doc = await getDoc();
    if (!doc) return fallbackData.departments;

    const sheet = doc.sheetsByTitle["Departments"];
    if (!sheet) return fallbackData.departments;

    const rows = await sheet.getRows();
    return rows.map((row) => ({
      id: row.get("id"),
      name: row.get("name"),
    }));
  } catch (error) {
    console.error("Error fetching departments from Google Sheets:", error);
    return fallbackData.departments;
  }
}

export async function getSchedules(): Promise<Schedule[]> {
  try {
    const doc = await getDoc();
    if (!doc) return fallbackData.schedules;

    const sheet = doc.sheetsByTitle["Schedules"];
    if (!sheet) return fallbackData.schedules;

    const rows = await sheet.getRows();
    return rows.map((row) => {
      const doctorIdsStr = row.get("doctorIds") || "";
      return {
        id: row.get("id"),
        date: row.get("date"),
        departmentId: row.get("departmentId"),
        doctorIds: doctorIdsStr.split(",").map((id: string) => id.trim()).filter(Boolean),
      };
    });
  } catch (error) {
    console.error("Error fetching schedules from Google Sheets:", error);
    return fallbackData.schedules;
  }
}

// --- Writers ---
export async function addSchedule(schedule: Schedule): Promise<boolean> {
  try {
    const doc = await getDoc();
    if (!doc) return false;

    const sheet = doc.sheetsByTitle["Schedules"];
    if (!sheet) return false;

    await sheet.addRow({
      id: schedule.id,
      date: schedule.date,
      departmentId: schedule.departmentId,
      doctorIds: schedule.doctorIds.join(","),
    });
    return true;
  } catch (error) {
    console.error("Error adding schedule to Google Sheets:", error);
    return false;
  }
}

export async function updateSchedule(schedule: Schedule): Promise<boolean> {
  try {
    const doc = await getDoc();
    if (!doc) return false;

    const sheet = doc.sheetsByTitle["Schedules"];
    if (!sheet) return false;

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("id") === schedule.id);
    if (row) {
      row.assign({
        date: schedule.date,
        departmentId: schedule.departmentId,
        doctorIds: schedule.doctorIds.join(","),
      });
      await row.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating schedule in Google Sheets:", error);
    return false;
  }
}

export async function deleteSchedule(id: string): Promise<boolean> {
  try {
    const doc = await getDoc();
    if (!doc) return false;

    const sheet = doc.sheetsByTitle["Schedules"];
    if (!sheet) return false;

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("id") === id);
    if (row) {
      await row.delete();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting schedule in Google Sheets:", error);
    return false;
  }
}
