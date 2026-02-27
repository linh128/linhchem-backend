const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const router = express.Router();

/**
 * API: POST /auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob , phone} = req.body;

    // 1️⃣ Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    // 2️⃣ Check email tồn tại
    const existing = await pool.query(
      'SELECT id FROM res_partner WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert
    const result = await pool.query(
      `
      INSERT INTO res_partner (name, email, password, role, dob, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, dob, phone
      `,
      [name, email, hashedPassword, 'user', dob, phone]
    );

    return res.status(200).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;