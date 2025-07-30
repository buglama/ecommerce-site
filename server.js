const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/articles", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;

        const response = await fetch("https://api.spreadconnect.app/articles", {
            headers: {
                "X-SPOD-ACCESS-TOKEN": "cd5ee4c7-382f-477d-a340-e7817f8ff55f",
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: "API çağırışı uğursuz oldu", details: data });
        }

        res.json(data);
    } catch (err) {
        console.error("❌ Server xətası:", err);
        res.status(500).json({ error: "Server xətası", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server işləyir: http://localhost:${PORT}`);
});
