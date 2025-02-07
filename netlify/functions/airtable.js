import Airtable from "airtable";

export async function handler(event) {
  const ALLOWED_ORIGIN = "https://oval-wrasse-d42r.squarespace.com";

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
  const BASE_ID = "apprJ5jpBcnV2RMNq"; // Your Airtable Base ID
  const TABLE_NAME = "tblAtevczMvwFUQos"; // Your Airtable Table Name

  const { name, email } = JSON.parse(event.body);

  // Initialize Airtable SDK
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

  try {
    // Create a new record in Airtable
    const record = await base(TABLE_NAME).create({
      "Full Name": name,  // Replace with your actual field names
      "Email Address": email,  // Replace with your actual field names
    });

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
