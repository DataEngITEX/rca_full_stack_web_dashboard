import pool from "../configs/postgres_db.js";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  //const filePath = path.join("uploads", req.file.originalname);
  const filePath = req.file.path;
  try {
    const results = await new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(filePath)
        .pipe(
          csvParser({
            mapHeaders: ({ header }) =>
              header.trim().toLowerCase().replace(/\s+/g, "_"),
            mapValues: ({ value }) => value.trim(),
          })
        )
        .on("data", (row) => {
          data.push(row);
        })
        .on("end", () => {
          resolve(data);
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    // Check if the results array is empty
    if (results.length === 0) {
      // Clean up the file even if it's empty
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
      return res.status(400).json({ error: "CSV file is empty or invalid." });
    }

    // Insert into staging table
    for (const row of results) {
      if (row.terminal_id) {
        await pool.query(
          `INSERT INTO ptsp_schema.rca_web_upload (terminal_id) VALUES ($1)`,
          [row.terminal_id]
        );
      }
    }

    // Perform INNER JOIN with merchant table
    const joinResult = await pool.query(`
      SELECT m.*
      FROM ptsp_schema.merchant_terminal_rca m
      INNER JOIN ptsp_schema.rca_web_upload r
      ON m.terminal_id = r.terminal_id
    `);

    // --- NEW LINE ADDED HERE ---
    // Truncate the staging table to prepare for the next upload
    await pool.query(
      `TRUNCATE TABLE ptsp_schema.rca_web_upload RESTART IDENTITY`
    );

    // Clean up the uploaded file after successful processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    res.json({
      message: "CSV uploaded and processed successfully",
      inserted: results.length,
      data: joinResult.rows,
    });
  } catch (err) {
    console.error("Error processing file:", err);
    // Clean up file in case of error too
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr)
        console.error("Failed to delete file after error:", unlinkErr);
    });
    res.status(500).json({ error: "File processing failed." });
  }
};
