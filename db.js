import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    host: "ep-snowy-sun-acw3earg-pooler.sa-east-1.aws.neon.tech",
    user: "neondb_owner",
    password: "npg_o8rwDLuSFks7",
    database: "neondb",
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

export const query = async (text, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
};