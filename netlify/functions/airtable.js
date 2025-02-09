const Airtable = require("airtable");

exports.handler = async (event) => {
  const ALLOWED_ORIGIN = "https://coral-burgundy-grj3.squarespace.com";

  // Handle CORS for preflight requests
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

  // Reject non-POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      body: "Method Not Allowed",
    };
  }

  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = "apprJ5jpBcnV2RMNq";
    const TABLE_NAME = "tblAtevczMvwFUQos";

    if (!AIRTABLE_API_KEY) {
      throw new Error("Missing Airtable API key.");
    }

    // Parse form data from Squarespace
    const { name, email } = JSON.parse(event.body);

    console.log("name ", name);
    console.log("email ", email);
    console.log("AIRTABLE_API_KEY ", AIRTABLE_API_KEY);
    console.log("BASE_ID ", BASE_ID);
    console.log("TABLE_NAME ", TABLE_NAME);

    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

    console.log("base ", base);

    // Create record in Airtable
    const record = await base(TABLE_NAME).create([
      {
        fields: {
            "fldKytC009uZQrBZ1": "Timothy Test",
            "fld9464ZaA4Si0a85": "timothy@fca.land"
        },
      },
    ]);

    console.log("record ", record);

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
    console.error("Airtable API Error:", error);

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
};
