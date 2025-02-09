const Airtable = require("airtable");
const axios = require("axios");

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
    const IPINFO_API_KEY = process.env.IPINFO_API_KEY; // Set this in Netlify environment variables

    if (!AIRTABLE_API_KEY || !IPINFO_API_KEY) {
      throw new Error("Missing required API keys.");
    }

    // Parse form data from Squarespace
    const { name, email } = JSON.parse(event.body);

    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

    // Get IP Address from request headers (IPv4 filtering)
    let rawIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "Unknown IP";
    rawIP = rawIP.split(",")[0].trim(); // Get first IP in case of multiple

    if (rawIP.includes("::ffff:")) {
      rawIP = rawIP.split("::ffff:")[1]; // Extract actual IPv4 if in IPv6 format
    }

    // Fetch geolocation data from ipinfo.io
    let userIP = `${rawIP} (No location data)`;
    try {
      const geoResponse = await axios.get(`https://ipinfo.io/${rawIP}/json?token=${IPINFO_API_KEY}`);
      const geoData = geoResponse.data;
      userIP = `${geoData.ip} - ${geoData.city}, ${geoData.region}, ${geoData.country} (ISP: ${geoData.org})`;
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

    // Create record in Airtable
    const record = await base(TABLE_NAME).create([
      {
        fields: {
          "fldKytC009uZQrBZ1": name,      // Name field
          "fld9464ZaA4Si0a85": email,     // Email field
          "fldXaPAnPCdkgeErr": userIP     // User IP (Formatted with location)
        },
      },
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
