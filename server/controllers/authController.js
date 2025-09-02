import jwt from "jsonwebtoken";
import pool from "../configs/postgres_db.js"; // your Postgres connection

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // query the DB
    const result = await pool.query(
      "SELECT * FROM ptsp_schema.rca_user_pass WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // plain text password check (NOT RECOMMENDED in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
