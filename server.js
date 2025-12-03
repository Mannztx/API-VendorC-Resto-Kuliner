const express = require('express');
const cors = require('cors');
const { dbVendorC } = require('./database/vendorC');
const app = express();
const port = process.env.port || 3003;

app.use(cors());
app.use(express.json());

const getAll = (db, sql) => {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

app.get('/api/products', async (req, res) => {
    try {
        standarData = await getAll(dbVendorC, "SELECT * FROM products");

        const nestedData = flatData.map(item = ({
            "id": item.id,
            "details": {
                "name": item.name,
                "category": item.category
            },
            "pricing": {
                "base_price": item.base_price,
                "tax": item.tax
            },
            "stock": item.stock
        }));
        res.json(nestedData);
    } catch (error) {
        console.error("API Vendor C Error", error);
        res.status(500).json({
            message: "Failed to fetch Vendor C data."
        });
    }
});

app.listen(port, () => {
    console.log(`API Vendor C running on localhost: ${port}`);
    console.log(`Endpoint: http://localhost:${port}/api/products`);
});