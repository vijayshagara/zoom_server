const axios = require("axios");

const generateAccessToken = async (req, res, next) => {
  const base64Credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");
  const basicAuthHeader = `Basic ${base64Credentials}`;

  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=T1RBxUcDTe6r0eIntL1pQQ",
      null, 
      {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const accessToken = response.data.access_token;
      res.locals.accessToken = accessToken; 
      next(); 
    } else {
      console.error("Failed to retrieve access token:", response.data);
      res.status(response.status).json(response.data); 
    }
  } catch (error) {
    console.error("Error during fetching access token:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  generateAccessToken,
};
