import pool from "../configs/postgres_db.js";

// controller = also service layer
export const getAllMerchants = async (req, res) => {
  try {
    const {
      page = 0,
      pageSize = 50,
      sortField = "merchant_name",
      sortOrder = "asc",
      filter = null,
    } = req.query;
    console.log("Query Params:", filter);
    const offset = page * pageSize;
    let query = null;
    if (filter) {
      query = `
        SELECT *
        FROM ptsp_schema.merchant_terminal_rca
        WHERE merchant_name ILIKE $3 OR terminal_id ILIKE $3 OR merchant_id ILIKE $3 OR 
        connected::text ILIKE $3 OR active::text ILIKE $3 OR inactive::text ILIKE $3
        OR bank ILIKE $3 OR ptsp ILIKE $3 OR ptsp_code ILIKE $3 OR state ILIKE $3 OR address ILIKE $3
        OR last_transaction_time ILIKE $3
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $1 OFFSET $2
      `;
    } else {
      query = `
      SELECT *
      FROM ptsp_schema.merchant_terminal_rca
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $1 OFFSET $2
    `;
    }
    const searchTerm = `%${filter}%`;
    const result = await pool.query(
      query,
      filter ? [pageSize, offset, searchTerm] : [pageSize, offset]
    );
    return res.json({
      rows: result.rows,
    });
  } catch (err) {
    console.error("Error fetching merchants:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMerchantStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) AS total_merchants,
        COUNT(*) FILTER (WHERE active = 1) AS active_merchants,
        COUNT(*) FILTER (WHERE inactive = 1) AS inactive_merchants,
        COUNT(*) FILTER (WHERE connected = 1) AS connected_merchants
      FROM ptsp_schema.merchant_terminal_rca;
    `;

    const result = await pool.query(query);
    res.json(result.rows[0]); // return the stats as JSON
  } catch (err) {
    console.error("Error fetching merchant stats:", err);
    res.status(500).json({ error: err.message });
  }
};
