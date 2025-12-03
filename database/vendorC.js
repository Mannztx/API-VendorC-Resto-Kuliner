require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const DB_vendorC = process.env.DB_vendorC || "vendorC.db";

const dbVendorC = new sqlite3.Database(DB_vendorC, (err) => {
  if (err) {
    console.error("Koneksi ke vendorC.db gagal:", err.message);
    throw err;
  } else {
    console.log("Koneksi ke vendorC.db berhasil");

    dbVendorC.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      tax INTEGER NOT NULL,
      stock INTEGER NOT NULL
    )`, (err) => {
      if (!err) {
        console.log("Table products created. Seeding initial data...");
        const insert = 'INSERT INTO products (id, name, category, base_price, tax, stock) VALUES (?, ?, ?, ?, ?, ?)';
        dbVendorC.run(insert, [501, "Nasi Tempong", "Food", 20000, 2000, 50]);
        dbVendorC.run(insert, [502, "Nasi Goreng", "Food", 12000, 1200, 50]);
        dbVendorC.run(insert, [503, "Nasi Pecel", "Food", 10000, 1000, 50]);
      }
    });
  }
});

module.exports = { dbVendorC };