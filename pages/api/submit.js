export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { name, email } = req.body;
  
    try {
      const response = await fetch("https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email
          }
        })
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }