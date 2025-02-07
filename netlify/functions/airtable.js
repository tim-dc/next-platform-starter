import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    // Handle CORS preflight request
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://oval-wrasse-d42r.squarespace.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "https://oval-wrasse-d42r.squarespace.com" },
      body: "Method Not Allowed"
    };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "apprJ5jpBcnV2RMNq";  // Replace with your actual Base ID
  const TABLE_NAME = "tblAtevczMvwFUQos"; // Replace with your actual Table ID

  const { name, email } = JSON.parse(event.body);

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            "fldKytC009uZQrBZ1": name,  // Replace with the actual field ID for Name
            "fldXyz1234567890": email,  // Replace with the actual field ID for Email
          },
        },
      ],
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://oval-wrasse-d42r.squarespace.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({ success: true, message: "Form submitted!", data }),
  };
}
