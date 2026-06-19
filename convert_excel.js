const xlsx = require('xlsx');
const fs = require('fs');

// We REMOVE cellDates: true so we get raw numbers (e.g. 46174 for 2026-06-01)
const workbook = xlsx.readFile('E:\\Cal\\Lich_Truc_Chuan_Hoa_Moi.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = xlsx.utils.sheet_to_json(sheet);

const departmentsMap = new Map(); // name -> id
const doctorsMap = new Map(); // name -> { id, department, title }
const schedules = [];

let deptCounter = 1;
let docCounter = 1;
let schedCounter = 1;

function getDeptId(name) {
  if (!departmentsMap.has(name)) {
    departmentsMap.set(name, `d${deptCounter++}`);
  }
  return departmentsMap.get(name);
}

function getDoctorId(name, deptName) {
  const cleanName = name.trim();
  if (!cleanName) return null;
  
  if (!doctorsMap.has(cleanName)) {
    doctorsMap.set(cleanName, {
      id: `dr${docCounter++}`,
      name: cleanName,
      department: deptName,
      title: "Bác sĩ"
    });
  }
  return doctorsMap.get(cleanName).id;
}

rawData.forEach(row => {
  let dateObj = row["Ngày"];
  let dateStr = "";
  
  if (typeof dateObj === "number") {
    // Excel date number to UTC Date string (Unix Epoch 25569 = 1970-01-01)
    // 86400 * 1000 = ms per day
    const date = new Date(Math.round((dateObj - 25569) * 86400 * 1000));
    dateStr = date.toISOString().split('T')[0];
  } else if (dateObj instanceof Date) {
    // Fallback if cellDates is somehow true or Date object returned
    const localDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
    dateStr = localDate.toISOString().split('T')[0];
  } else {
    dateStr = String(dateObj); // fallback
  }

  const dailyDeptDoctors = {};

  Object.keys(row).forEach(key => {
    if (key === "Ngày") return;
    
    // Extract department name
    const deptNameMatch = key.match(/^(.*?)(?: - BS\d+)?$/);
    const deptName = deptNameMatch ? deptNameMatch[1].trim() : key.trim();
    
    const value = row[key];
    if (!value) return;

    const docNames = String(value).split(/\s*-\s*|,\s*/);
    
    const deptId = getDeptId(deptName);
    if (!dailyDeptDoctors[deptId]) {
      dailyDeptDoctors[deptId] = [];
    }

    docNames.forEach(docName => {
      const docId = getDoctorId(docName, deptName);
      if (docId && !dailyDeptDoctors[deptId].includes(docId)) {
        dailyDeptDoctors[deptId].push(docId);
      }
    });
  });

  // Create schedule entries
  Object.keys(dailyDeptDoctors).forEach(deptId => {
    const docIds = dailyDeptDoctors[deptId];
    if (docIds.length > 0) {
      schedules.push({
        id: `s${schedCounter++}`,
        date: dateStr,
        departmentId: deptId,
        doctorIds: docIds
      });
    }
  });
});

const finalData = {
  departments: Array.from(departmentsMap.entries()).map(([name, id]) => ({ id, name })),
  doctors: Array.from(doctorsMap.values()),
  schedules: schedules
};

fs.writeFileSync('E:\\Cal\\data\\fallback.json', JSON.stringify(finalData, null, 2));
console.log(`Successfully converted ${rawData.length} rows.`);
console.log(`Found ${finalData.departments.length} departments, ${finalData.doctors.length} doctors, and created ${finalData.schedules.length} schedule entries.`);
