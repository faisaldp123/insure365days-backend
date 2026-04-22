const XLSX = require('xlsx');

exports.parseExcel = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data.map(row => ({
    name: row.Name,
    email: row.Email,
    phone: row.Phone,
    dob: row.DateOfBirth,
    insuranceType: row.InsuranceType,
    address: row.Address
  }));
};
