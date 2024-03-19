const axios = require("axios"); // Import the axios module for making HTTP requests
const PDFParser = require("pdf-parse"); // Import the PDF parser module

const statement1 = `University Dining Services makes every effort to ensure the items listed on our menus are up to date and correct. However, the items listed are not a guarantee and are subject to change without notice`;
const statement2 = `Dinner Action Stations are available from 4pm-7pm, or until the special runs out`;
const statement3 = `Lunch Feature Stations are available from 11am-2pm, or until the special runs out`;
const statement4 = `Please also see our Fixed Menu for the complete list of items we carry each day`;
const statement5 = `University Dining Hall - Weekly Menu`;
const statement6 = `Breakfast Entrée`;
const statement7 = `Lunch Entrée`;
const statement8 = `Dinner Entrée 1`;
const statement9 = `Entrée 2`;
const statement10 = `Vegan Entrée`;
const statement11 = `Side`;
const statement12 = `Feature Station`;
const statement13 = `Soup Station`;
const statement14 = `Action Station`;

async function fetchAndExtractText() {
  try {
    // Note: await is used to wait for the promise to resolve
    const link =
      "https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-2024-3-17.pdf";
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const data = response.data;

    // PDFParser also returns a promise, so you need to await it
    const pdf = await PDFParser(data);

    // console.log(pdf.text);

    // Now you can safely access pdf.text
    let text = pdf.text.replace(statement1, ""); // Remove the target text
    text = text.replace(statement2, ""); // Remove the target text
    text = text.replace(statement3, ""); // Remove the target text
    text = text.replace(statement4, ""); // Remove the target text
    text = text.replace(statement5, ""); // Remove the target text
    text = text.replace(/([a-zA-Z])(\d)/g, "$1 $2"); // Add space between letters and numbers
    text = text.replace(/([a-z])([A-Z])/g, "$1 | $2"); // Add space between letters and capital letters
    text = text.replace(/\s+/g, " "); // Replace multiple spaces with a space
    text = text.replace(/(\d{4})(\d{1,2})/g, "$1 | $2"); // Add space after the fourth digit for 5 or 6-digit numbers
    text = text.replace(/(\d)([A-Z])/g, "$1 | $2");
    text = text.replace(statement6, "| Breakfast | Entrée |");
    text = text.replace(statement7, "| Lunch | Entrée |");
    text = text.replace(statement8, "| Dinner | Entrée 1 |");
    text = text.replace(statement9, "| Entrée 2 |");
    text = text.replace(statement10, "| Vegan Entrée |");
    text = text.replace(statement11, "| Side |");
    text = text.replace(statement12, "| Feature Station |");
    text = text.replace(/(Option \d)/g, "| $1 |");
    text = text.replace(statement13, "| Soup Station |");
    text = text.replace(statement14, "| Action Station |");
    text = text.replace(/(Closed)/g, "| Closed |");
    text = text.replace(/(Chef\'s Choice)/g, "| Chef's Choice |");
    text = text.replace(/(\|\s\|)/g, "|");
    text = text.replace(/(\|\s\|)/g, "|");
    console.log(text);
    return text;
  } catch (error) {
    // It's important to catch and handle errors
    console.error("Error fetching or parsing the PDF:", error);
  }
}

fetchAndExtractText();
