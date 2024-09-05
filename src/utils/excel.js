import ExcelJS from "exceljs";

async function generateExcel(applications) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  worksheet.addRow(["user Tech Skills", "user Soft Skills", "userId"]);

  applications.forEach((application) => {
    worksheet.addRow([
      application.userTechSkills,
      application.userSoftSkills,
      application.userId,
    ]);
  });

  const excelFileName = "application";
  await workbook.xlsx.writeFile(`./${excelFileName}`);

  return excelFileName;
}

export default generateExcel;
