// src/routes/orders.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.OrderID AS orderId,
        o.CustID AS customerId,
        o.ShopID AS shopId,
        o.SvcID AS serviceId,
        o.LndryDtlID AS laundryDetailId,
        o.DlvryID AS deliveryId,
        o.OrderCreatedAt AS createdAt, -- This is required for sorting on the frontend
        os.OrderStatus AS status,
        os.OrderUpdatedAt AS updatedAt,
        c.CustName AS customerName
      FROM Orders o
      JOIN Customer c
        ON o.CustID = c.CustID
      JOIN Order_Status os 
        ON o.OrderID = os.OrderID
      -- This subquery join ensures we only get the row with the latest timestamp
      JOIN (
        SELECT 
          OrderID, 
          MAX(OrderUpdatedAt) AS max_updated_at
        FROM Order_Status
        GROUP BY OrderID
      ) AS latest_os 
        ON os.OrderID = latest_os.OrderID AND os.OrderUpdatedAt = latest_os.max_updated_at
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;