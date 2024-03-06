const axios = require("axios"); // Import the axios module for making HTTP requests
const PDFParser = require("pdf-parse"); // Import the PDF parser module

const statement1 = `University Dining Services makes every effort to ensure the items listed on our menus are up to date and correct. However, the items listed are not a guarantee and are subject to change without notice`;
const statement2 = `Dinner Action Stations are available from 4pm-7pm, or until the special runs out`;
const statement3 = `Lunch Feature Stations are available from 11am-2pm, or until the special runs out`;
const statement4 = `Please also see our Fixed Menu for the complete list of items we carry each day`;
const statement5 = `University Dining Hall - Weekly Menu`;

async function fetchAndExtractText() {
  try {
    // Note: await is used to wait for the promise to resolve
    const link =
      "https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-2024-3-3.pdf";
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const data = response.data;

    // PDFParser also returns a promise, so you need to await it
    const pdf = await PDFParser(data);

    // Now you can safely access pdf.text
    let text = pdf.text.replace(statement1, ""); // Remove the target text
    text = text.replace(statement2, ""); // Remove the target text
    text = text.replace(statement3, ""); // Remove the target text
    text = text.replace(statement4, ""); // Remove the target text
    text = text.replace(statement5, ""); // Remove the target text
    text = text.replace(/([a-zA-Z])(\d)/g, "$1 $2"); // Add space between letters and numbers
    text = text.replace(/\s+/g, " "); // Replace multiple spaces with a space
    text = text.replace(/(\d{4})(\d{1,2})/g, "$1 | $2"); // Add space after the fourth digit for 5 or 6-digit numbers
    text = text.replace(/(\w)([A-Z])/g, "$1 | $2"); // Add space between words and capital letters
    console.log(text);
    return text;
  } catch (error) {
    // It's important to catch and handle errors
    console.error("Error fetching or parsing the PDF:", error);
  }
}

fetchAndExtractText();
