import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "apprJ5jpBcnV2RMNq"; // Your Airtable Base ID
  const TABLE_NAME = "tblAtevczMvwFUQos"; // Your Airtable Table ID

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
            fields: { "Owner's Full Name": name, "fld9464ZaA4Si0a85": email },
        },
      ],
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Form submitted!", data }),
  };
}
