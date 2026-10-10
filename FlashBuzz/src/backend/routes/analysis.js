
import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const router = express.Router();

const uploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const upload = multer({
  dest: uploadDirectory,
  limits: { fileSize: 25 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(
      [".csv", ".xlsx", ".xls"].includes(ext)
        ? null
        : new Error("Only CSV and Excel files are supported."),
      [".csv", ".xlsx", ".xls"].includes(ext)
    );
  }
});

const REQUIRED_COLUMNS = [
  "Order_ID",
  "Order_Date",
  "Product_Name",
  "Category",
  "Region",
  "Quantity",
  "Unit_Price",
  "Discount_Percent",
  "Sales_Amount",
  "Cost_Per_Unit"
];

const ALIASES = {
  Order_ID: ["order_id", "orderid", "order_number", "ordernumber", "invoice_id", "invoicenumber", "transaction_id"],
  Order_Date: ["order_date", "orderdate", "date", "sales_date", "invoice_date"],
  Product_Name: ["product_name", "product", "productname", "item", "product_code", "productcode", "item_name", "product_title", "description"],
  Category: ["category", "product_category", "productline", "product_line", "department"],
  Region: ["region", "country", "territory", "state", "city", "location", "zone", "area"],
  Quantity: ["quantity", "qty", "quantityordered", "units", "units_sold", "order_qty"],
  Unit_Price: ["unit_price", "unitprice", "price_per_unit", "selling_price", "priceeach", "price_each", "price", "rate", "unit_rate"],
  Discount_Percent: ["discount_percent", "discount", "discount_percentage", "discount_rate", "discount_pct"],
  Sales_Amount: ["sales_amount", "sales", "revenue", "total_sales", "amount", "total_amount", "net_sales"],
  Cost_Per_Unit: ["cost_per_unit", "unit_cost", "cost", "purchase_price", "unit_cost_price", "cogs"]
};


function cleanNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }

  const cleaned = String(value ?? "")
    .replace(/[₹$€£,\s]/g, "")
    .replace(/%$/, "")
    .trim();

  if (!cleaned) return NaN;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : NaN;
}


function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}


function inspectRawDataset(rows) {
  const headers = Object.keys(rows[0] || []);
  const missingValues = {};
  const columnTypes = {};
  const normalizedRows = new Set();

  let missingCellCount = 0;
  let duplicateRowCount = 0;
  let emptyRowCount = 0;

  function isMissing(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (typeof value === "number" && !Number.isFinite(value))
    );
  }

  function inferType(values, columnName) {
    const nonEmpty = values.filter((value) => !isMissing(value));

    if (nonEmpty.length === 0) return "empty";

    if (
      /date|time/i.test(columnName) ||
      nonEmpty.every(
        (value) =>
          value instanceof Date ||
          (typeof value === "string" &&
            /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value.trim()))
      )
    ) {
      const validDates = nonEmpty.every((value) => {
        const date = value instanceof Date ? value : new Date(value);
        return !Number.isNaN(date.getTime());
      });

      if (validDates) return "date";
    }

    if (
      nonEmpty.every(
        (value) =>
          typeof value === "boolean" ||
          ["true", "false", "yes", "no"].includes(
            String(value).trim().toLowerCase()
          )
      )
    ) {
      return "boolean";
    }

    if (nonEmpty.every((value) => Number.isFinite(cleanNumber(value)))) {
      return "number";
    }

    return "text";
  }

  for (const header of headers) {
    const values = rows.map((row) => row[header]);
    const missing = values.filter(isMissing).length;

    missingValues[header] = missing;
    missingCellCount += missing;
    columnTypes[header] = inferType(values, header);
  }

  for (const row of rows) {
    const values = headers.map((header) => row[header]);

    if (values.every(isMissing)) {
      emptyRowCount++;
    }

    const signature = JSON.stringify(
      headers.map((header) => {
        const value = row[header];

        return value instanceof Date
          ? value.toISOString()
          : value;
      })
    );

    if (normalizedRows.has(signature)) {
      duplicateRowCount++;
    } else {
      normalizedRows.add(signature);
    }
  }

  return {
    rowCount: rows.length,
    columnCount: headers.length,
    columns: headers.map((name) => ({
      name,
      detectedType: columnTypes[name],
      missingValues: missingValues[name],
      missingPercentage: rows.length
        ? Math.round((missingValues[name] / rows.length) * 10000) / 100
        : 0,
    })),
    missingCellCount,
    duplicateRowCount,
    emptyRowCount,
    cleanRowCount: rows.length - duplicateRowCount,
  };
}


function cleanDataset(rows, options = {}) {
  const {
    removeEmptyRows = true,
    removeDuplicates = false,
    trimText = true,
    normalizeNumbers = true,
  } = options;

  const originalCount = rows.length;

  function isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    );
  }

  let cleanedRows = rows.map((row) => {
    const cleanedRow = {};

    for (const [key, originalValue] of Object.entries(row)) {
      let value = originalValue;

      if (trimText && typeof value === "string") {
        value = value.trim();
      }

      if (
        normalizeNumbers &&
        typeof value === "string" &&
        value.trim() !== "" &&
        /[₹$€£,]/.test(value)
      ) {
        const parsed = cleanNumber(value);

        if (Number.isFinite(parsed)) {
          value = parsed;
        }
      }

      cleanedRow[key] = value;
    }

    return cleanedRow;
  });

  let emptyRowsRemoved = 0;
  let duplicateRowsRemoved = 0;

  if (removeEmptyRows) {
    const before = cleanedRows.length;

    cleanedRows = cleanedRows.filter((row) =>
      Object.values(row).some((value) => !isEmpty(value))
    );

    emptyRowsRemoved = before - cleanedRows.length;
  }

  if (removeDuplicates) {
    const seen = new Set();
    const uniqueRows = [];

    for (const row of cleanedRows) {
      const signature = JSON.stringify(
        Object.keys(row).sort().map((key) => row[key])
      );

      if (seen.has(signature)) {
        duplicateRowsRemoved++;
      } else {
        seen.add(signature);
        uniqueRows.push(row);
      }
    }

    cleanedRows = uniqueRows;
  }

  return {
    rows: cleanedRows,
    summary: {
      originalRows: originalCount,
      cleanedRows: cleanedRows.length,
      emptyRowsRemoved,
      duplicateRowsRemoved,
      textTrimmed: trimText,
      numberFormattingEnabled: normalizeNumbers,
    },
  };
}


function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizeRows(inputRows) {
  if (!inputRows.length) {
    return { rows: [], missingColumns: REQUIRED_COLUMNS };
  }

  const headers = Object.keys(inputRows[0]);
  const headerLookup = new Map(
    headers.map((header) => [normalizeHeader(header), header])
  );

  const mapping = {};

  for (const canonical of REQUIRED_COLUMNS) {
    const possibleNames = [
      canonical,
      ...(ALIASES[canonical] || [])
    ];

    for (const name of possibleNames) {
      const actual = headerLookup.get(normalizeHeader(name));
      if (actual !== undefined) {
        mapping[canonical] = actual;
        break;
      }
    }
  }

  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !mapping[column]
  );

  const rows = inputRows.map((source) => {
    const row = {};

    for (const column of REQUIRED_COLUMNS) {
      const actualHeader = mapping[column];
      row[column] = actualHeader ? source[actualHeader] : null;
    }

    for (const column of [
      "Quantity",
      "Unit_Price",
      "Discount_Percent",
      "Sales_Amount",
      "Cost_Per_Unit"
    ]) {
      row[column] = cleanNumber(row[column]);
    }

    return row;
  });

  return { rows, missingColumns };
}

function sum(values) {
  return round(values.reduce((total, value) => total + value, 0));
}

function groupSales(rows, column) {
  const groups = {};

  for (const row of rows) {
    const label = String(row[column] ?? "").trim() || "Unknown";
    if (!groups[label]) {
      groups[label] = {
        name: label,
        sales: 0,
        quantity: 0,
        orders: new Set(),
        cost: 0,
        profit: 0,
        profitAvailable: true
      };
    }

    const group = groups[label];
    const quantity = Number.isFinite(row.Quantity) ? row.Quantity : 0;
    const sales = Number.isFinite(row.Sales_Amount)
      ? row.Sales_Amount
      : 0;

    group.sales += sales;
    group.quantity += quantity;

    if (row.Order_ID !== null && String(row.Order_ID).trim()) {
      group.orders.add(String(row.Order_ID).trim());
    }

    if (Number.isFinite(row.Cost_Per_Unit)) {
      group.cost += quantity * row.Cost_Per_Unit;
      group.profit += sales - quantity * row.Cost_Per_Unit;
    } else {
      group.profitAvailable = false;
    }
  }

  return Object.values(groups)
    .map((group) => ({
      name: group.name,
      sales: round(group.sales),
      quantity: round(group.quantity),
      orderCount: group.orders.size,
      cost: group.profitAvailable ? round(group.cost) : null,
      profit: group.profitAvailable ? round(group.profit) : null,
      profitMargin:
        group.profitAvailable && group.sales !== 0
          ? round((group.profit / group.sales) * 100)
          : null
    }))
    .sort((a, b) => b.sales - a.sales);
}

function analyzeSales(rows) {
  const validRows = rows.filter(
    (row) =>
      Number.isFinite(row.Sales_Amount) &&
      Number.isFinite(row.Quantity)
  );

  const totalSales = sum(validRows.map((row) => row.Sales_Amount));
  const totalQuantity = sum(validRows.map((row) => row.Quantity));

  const orderIds = new Set(
    validRows
      .map((row) => String(row.Order_ID ?? "").trim())
      .filter(Boolean)
  );

  const hasCost = validRows.length > 0 &&
    validRows.every((row) => Number.isFinite(row.Cost_Per_Unit));

  const totalCost = hasCost
    ? sum(validRows.map((row) => row.Quantity * row.Cost_Per_Unit))
    : null;

  const grossSales = sum(
    validRows.map((row) => {
      const discount = Number.isFinite(row.Discount_Percent)
        ? row.Discount_Percent
        : 0;
      const price = Number.isFinite(row.Unit_Price) ? row.Unit_Price : 0;
      return row.Quantity * price;
    })
  );

  const discountAmount = sum(
    validRows.map((row) => {
      const discount = Number.isFinite(row.Discount_Percent)
        ? row.Discount_Percent
        : 0;
      const price = Number.isFinite(row.Unit_Price) ? row.Unit_Price : 0;
      return row.Quantity * price * discount / 100;
    })
  );

  const products = groupSales(validRows, "Product_Name");
  const categories = groupSales(validRows, "Category");
  const regions = groupSales(validRows, "Region");

  const monthly = {};

  for (const row of validRows) {
    if (!row.Order_Date) continue;

    const date = new Date(row.Order_Date);
    if (Number.isNaN(date.getTime())) continue;

    const month = date.toISOString().slice(0, 7);
    monthly[month] = (monthly[month] || 0) + row.Sales_Amount;
  }

  const monthlyTrend = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, sales]) => ({ month, sales: round(sales) }));

  const totalProfit = hasCost ? round(totalSales - totalCost) : null;

  const kpis = [
    { id: "total_sales", label: "Total Sales", value: totalSales, type: "currency" },
    { id: "gross_sales", label: "Gross Sales Before Discount", value: grossSales, type: "currency" },
    { id: "total_discount", label: "Discount Amount", value: discountAmount, type: "currency" },
    { id: "total_quantity", label: "Total Quantity Sold", value: totalQuantity, type: "number" },
    { id: "total_orders", label: "Total Orders", value: orderIds.size, type: "count" },
    {
      id: "average_order_value",
      label: "Average Order Value",
      value: orderIds.size ? round(totalSales / orderIds.size) : 0,
      type: "currency"
    },
    {
      id: "profit",
      label: hasCost ? (totalProfit >= 0 ? "Gross Profit" : "Gross Loss") : "Profit / Loss",
      value: totalProfit,
      type: hasCost ? "currency" : "unavailable"
    },
    {
      id: "profit_margin",
      label: "Profit Margin",
      value: hasCost && totalSales !== 0
        ? round((totalProfit / totalSales) * 100)
        : null,
      type: hasCost ? "percentage" : "unavailable"
    }
  ];

  const insights = [];

  if (products.length) {
    insights.push({
      type: "product",
      title: "Top-selling product",
      message: `${products[0].name} generated ${products[0].sales.toLocaleString("en-IN")} in sales.`
    });
  }

  if (regions.length) {
    insights.push({
      type: "region",
      title: "Top region",
      message: `${regions[0].name} generated ${regions[0].sales.toLocaleString("en-IN")} in sales.`
    });
  }

  if (hasCost) {
    const lossProducts = products.filter((product) => product.profit < 0);
    if (lossProducts.length) {
      insights.push({
        type: "loss",
        title: "Loss-making products",
        message: lossProducts.map((product) => product.name).join(", ")
      });
    }
  } else {
    insights.push({
      type: "data_quality",
      title: "Profit unavailable",
      message: "Valid Cost_Per_Unit values are needed to calculate profit or loss."
    });
  }

  return {
    rowCount: validRows.length,
    totalSales,
    grossSales,
    discountAmount,
    totalQuantity,
    totalOrders: orderIds.size,
    totalCost,
    totalProfit,
    profitAvailable: hasCost,
    products,
    categories,
    regions,
    monthlyTrend,
    kpis,
    insights
  };
}


function analyzeDataset(inputRows) {
  const rows = Array.isArray(inputRows) ? inputRows : [];
  const headers = [...new Set(rows.flatMap((row) =>
    row && typeof row === "object" ? Object.keys(row) : []
  ))];

  const isMissing = (value) =>
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  const toNumber = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== "string" || !value.trim()) return null;

    const cleaned = value
      .trim()
      .replace(/[₹$€£,\s]/g, "")
      .replace(/^\((.*)\)$/, "-$1")
      .replace(/%$/, "");

    if (!cleaned || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;

    const number = Number(cleaned);
    return Number.isFinite(number) ? number : null;
  };

  const columnsInfo = headers.map((name) => {
    const values = rows.map((row) => row?.[name]);
    const present = values.filter((value) => !isMissing(value));
    const numericValues = present.map(toNumber);
    const allNumeric =
      present.length > 0 && numericValues.every((value) => value !== null);

    const dates = present.map((value) => {
      if (value instanceof Date) return value;
      if (typeof value !== "string" || !value.trim()) return null;

      // Only infer dates when the column name suggests a date/time.
      if (!/date|time|timestamp|created|updated/i.test(name)) return null;

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    });

    const allDates =
      present.length > 0 && dates.every((date) => date instanceof Date);

    const uniqueValues = new Set(
      present.map((value) => String(value).trim())
    );

    let type = "text";
    if (present.length === 0) type = "empty";
    else if (allDates) type = "date";
    else if (
      present.every((value) =>
        ["true", "false", "yes", "no"].includes(
          String(value).trim().toLowerCase()
        )
      )
    ) type = "boolean";
    else if (allNumeric) type = "number";

    const numbers = allNumeric ? numericValues : [];
    const total = numbers.reduce((sum, value) => sum + value, 0);

    return {
      name,
      type,
      detectedType: type,
      semanticRole:
        /id|code|number/i.test(name) && uniqueValues.size === present.length
          ? "identifier"
          : /date|time/i.test(name)
            ? "date"
            : allNumeric
              ? "measure"
              : uniqueValues.size <= Math.max(20, present.length * 0.1)
                ? "category"
                : "dimension",
      missing: values.filter(isMissing).length,
      missingValues: values.filter(isMissing).length,
      missingPercentage: rows.length
        ? Math.round(
            (values.filter(isMissing).length / rows.length) * 10000
          ) / 100
        : 0,
      uniqueValues: uniqueValues.size,
      statistics: allNumeric
        ? {
            count: numbers.length,
            sum: total,
            mean: numbers.length ? total / numbers.length : null,
            min: numbers.length ? Math.min(...numbers) : null,
            max: numbers.length ? Math.max(...numbers) : null
          }
        : null
    };
  });

  const numericColumns = columnsInfo.filter(
    (column) => column.type === "number"
  );

  const categoryAnalysis = columnsInfo
    .filter((column) =>
      ["text", "boolean"].includes(column.type) &&
      column.semanticRole !== "identifier"
    )
    .map((column) => {
      const counts = new Map();

      for (const row of rows) {
        const value = row?.[column.name];
        if (isMissing(value)) continue;

        const key = String(value).trim();
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      return {
        column: column.name,
        topValues: [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      };
    });

  const insights = [];

  for (const column of columnsInfo) {
    if (column.missing > 0) {
      insights.push({
        type: "data_quality",
        severity: "warning",
        title: `Missing values in ${column.name}`,
        description:
          `${column.missing} of ${rows.length} rows ` +
          `(${column.missingPercentage}%) have missing values.`
      });
    }
  }

  for (const column of numericColumns) {
    if (column.statistics) {
      insights.push({
        type: "numeric_summary",
        severity: "info",
        title: `${column.name} summary`,
        description:
          `Average: ${column.statistics.mean}; ` +
          `minimum: ${column.statistics.min}; ` +
          `maximum: ${column.statistics.max}.`
      });
    }
  }

  const kpis = [
    {
      id: "total_records",
      label: "Total Records",
      value: rows.length,
      type: "number"
    },
    {
      id: "total_columns",
      label: "Total Columns",
      value: headers.length,
      type: "number"
    },
    {
      id: "duplicate_records",
      label: "Duplicate Records",
      value: Math.max(
        0,
        rows.length - new Set(
          rows.map((row) => JSON.stringify(row))
        ).size
      ),
      type: "number"
    },
    {
      id: "missing_cells",
      label: "Missing Cells",
      value: columnsInfo.reduce(
        (total, column) => total + column.missing,
        0
      ),
      type: "number"
    }
  ];

  for (const column of numericColumns.slice(0, 4)) {
    kpis.push({
      id: `sum_${column.name}`,
      label: `Total ${column.name}`,
      value: column.statistics?.sum ?? null,
      type: "number",
      sourceColumn: column.name
    });

    kpis.push({
      id: `average_${column.name}`,
      label: `Average ${column.name}`,
      value: column.statistics?.mean ?? null,
      type: "number",
      sourceColumn: column.name
    });
  }

  const inspection = inspectRawDataset(rows);

  return {
    profile: {
      rows: rows.length,
      columns: headers.length,
      columnsInfo
    },
    rowCount: rows.length,
    columnCount: headers.length,
    columns: columnsInfo,
    kpis,
    categoryAnalysis,
    insights,
    inspection,
    missingColumns: columnsInfo
      .filter((column) => column.missing > 0)
      .map((column) => column.name),
    normalizedRows: rows
  };
}



router.post("/upload", upload.array("files", 10), async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    if (!uploadedFiles.length) {
      return res.status(400).json({ message: "No files were uploaded." });
    }


    const results = [];

    for (const file of uploadedFiles) {
      try {
        const workbook = XLSX.readFile(file.path, { cellDates: true });
        const sheets = [];

        
for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: null
    });

    const inspection = inspectRawDataset(rows);
    const cleaningResult = cleanDataset(rows);
    const analysis = analyzeDataset(cleaningResult.rows);

    sheets.push({
        name: sheetName,
        analysis,
        inspection,
        cleaningSummary: cleaningResult.summary,
        preview: rows.slice(0, 10),
        cleanedPreview: cleaningResult.rows.slice(0, 10)
    });
}



        results.push({
          originalName: file.originalname,
          size: file.size,
          type: file.mimetype,
          sheets
        });
      } finally {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    return res.status(200).json({
      message: "Dataset analyzed successfully.",
      files: results
    });
  } catch (error) {
    for (const file of uploadedFiles) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    console.error("FlashBuzz analysis error:", error);

    return res.status(500).json({
      message: "Failed to analyze uploaded files.",
      error: error.message
    });
  }
});

export default router;

