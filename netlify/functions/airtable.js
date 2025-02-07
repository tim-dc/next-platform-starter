const fetch = require("node-fetch");

exports.handler = async (event) => {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "apprJ5jpBcnV2RMNq";
  const TABLE_NAME = "tblAtevczMvwFUQos";

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};