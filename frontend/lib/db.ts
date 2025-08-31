import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'travel_helper'
  });
}

export async function getAllHotels() {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT h.*, d.name as destination_name, d.province FROM hotels h JOIN destinations d ON h.destination_id = d.id'
    );
    return rows;
  } finally {
    await connection.end();
  }
}

export async function getFilteredHotels({
  destination,
  priceMin,
  priceMax,
  amenities = [],
  rating = 0,
  view = []
}: {
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  rating?: number;
  view?: string[];
}) {
  const connection = await createConnection();
  try {
    let query = `
      SELECT h.*, d.name as destination_name, d.province 
      FROM hotels h 
      JOIN destinations d ON h.destination_id = d.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (destination) {
      query += ` AND (d.name LIKE ? OR d.province LIKE ?)`;
      params.push(`%${destination}%`, `%${destination}%`);
    }

    if (priceMin !== undefined && priceMax !== undefined) {
      query += ` AND h.price BETWEEN ? AND ?`;
      params.push(priceMin, priceMax);
    }

    if (rating > 0) {
      query += ` AND h.rating >= ?`;
      params.push(rating);
    }

    if (view && view.length > 0) {
      query += ` AND h.view IN (?)`;
      params.push(view);
    }

    if (amenities && amenities.length > 0) {
      const amenityConditions = amenities.map(() => 'JSON_CONTAINS(h.amenities, JSON_ARRAY(?))').join(' AND ');
      query += ` AND (${amenityConditions})`;
      params.push(...amenities);
    }

    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    await connection.end();
  }
}
