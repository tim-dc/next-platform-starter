import fetch from "node-fetch";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "Method Not Allowed"
      };
    }
  
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = "apprJ5jpBcnV2RMNq";
    const TABLE_NAME = "tblAtevczMvwFUQos";
  
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
              "fldKytC009uZQrBZ1": name,
              "fldXyz1234567890": email,
            },
          },
        ],
      }),
    });
  
    const data = await response.json();
  
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" }, // Allow Squarespace to access
      body: JSON.stringify({ success: true, message: "Form submitted!", data }),
    };
  }