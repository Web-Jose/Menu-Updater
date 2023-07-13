const axios = require("axios");
const PDFParser = require("pdf-parse");
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to format the date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to get the past Sunday's date
function getPastSundayDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 7 : dayOfWeek; // Calculate the difference from Sunday
  const pastSunday = new Date(today.setDate(today.getDate() - diff));
  return pastSunday;
}

// Function to generate the link based on the past Sunday's date
function generateLink() {
  const pastSunday = getPastSundayDate();
  const formattedDate = formatDate(pastSunday);
  const link = `https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-${formattedDate}.pdf`;
  return link;
}

// Function to fetch the PDF and extract text
async function fetchAndExtractText() {
  try {
    const link = generateLink();
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const data = response.data;
    const pdf = await PDFParser(data);
    let text = pdf.text.replace(/\s+/g, " "); // Replace multiple spaces with a single space
    text = text.replace(/(\w)([A-Z])/g, "$1 $2"); // Add space between words and capital letters
    text = text.replace(/(\d{4})(\d{1,2})/g, "$1 $2"); // Add space after the fourth digit for 5 or 6-digit numbers
    text = text.replace(/([a-zA-Z])(\d)/g, "$1 $2"); // Add space between letters and numbers
    return text;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Example usage
fetchAndExtractText()
  .then((text) => {
    console.log(text);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
