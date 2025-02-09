const Airtable = require('airtable'); // ✅ Fix import

export async function handler(event) {
  const ALLOWED_ORIGIN = "https://coral-burgundy-grj3.squarespace.com";

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      body: "Method Not Allowed"
    };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "apprJ5jpBcnV2RMNq";
  const TABLE_NAME = "tblAtevczMvwFUQos";

  const { name, email } = JSON.parse(event.body);

  // ✅ Correct Airtable Initialization
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

  console.log("key ", AIRTABLE_API_KEY);
  console.log("name ", name);
  console.log("email ", email);
  console.log("base ", base);

  try {
    const record = await base(TABLE_NAME).create([
      {
        fields: {
          "Full Name": name,
          "Email Address": email,
        }
      }
    ]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ success: true, message: "Form submitted!", record }),
    };
  } catch (error) {
    console.error("Error creating record:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
    };
  }
}
