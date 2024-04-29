const axios = require("axios"); // Import the axios module for making HTTP requests
const PDFParser = require("pdf-parse"); // Import the PDF parser module
const fs = require("fs"); // Import the Node.js file system module
require("dotenv").config();
console.log(process.env.OPENAI_API_KEY); // Check if it logs correctly
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to format the date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
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
  const link =
    "https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-" +
    formattedDate +
    ".pdf";
  return link;
}

console.log(generateLink());

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

// Function to fetch the PDF and extract text
async function fetchAndExtractText() {
  try {
    const link = generateLink();
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const data = response.data;
    const pdf = await PDFParser(data);
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
    console.error("Error fetching or parsing the PDF:", error);
    throw error;
  }
}

async function GeneratePrompt() {
  try {
    const PDFtext = await fetchAndExtractText();
    const prompt = PDFtext;
    return prompt;
  } catch (error) {
    console.error("Error generating the prompt:", error);
    throw error;
  }
}

async function createChatCompletion() {
  try {
    const prompt = await GeneratePrompt(); // Wait for the prompt text to be generated
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are tasked with transforming a detailed weekly dining menu from text format into a clean and organized JSON structure. Each day from Sunday to Saturday should be a top-level key, without dates, leading to nested objects for each meal period: Breakfast, Lunch, Dinner, and Dessert. For each meal, structure it with the following details: Entrée (singular) or Entrée 1, Entrée 2 for multiple entries in lunch and dinner. Sides should be labeled as Side 1 and Side 2 when used in breakfast. Include a Protein category under breakfast when necessary. Vegan Entrée where applicable, especially for lunch and dinner. Each entrée or meal component should directly list the food item as a value without nesting them further into categories or as objects. Vegetable should list the dish served. Feature Station and Soup Station under lunch. Soup Station may include subcategories like Option 1 and Option 2 for variety. In the Dinner section, you might also include an Action Station when provided. For Dessert, use a straightforward format with Specialty Dessert followed by the dessert name. Ensure that each meal component is concise, using direct strings for dishes without additional sub-categorization unless specified, such as in Soup Station. The format should be clean, user-friendly, and easy to read, without redundant or empty objects. Please follow these guidelines precisely to ensure that the output JSON is usable and error-free.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2500,
    });
    // Extract the output message from the API response
    const outputMessage = completion.data.choices[0].message;
    console.log(outputMessage);

    // Convert the JSON-formatted string to a JavaScript object
    const menuData = JSON.parse(outputMessage.content);

    // Write the data to the Menu.json file in the same folder
    fs.writeFile("Menu.json", JSON.stringify(menuData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to Menu.json:", err);
      } else {
        console.log("Output saved to Menu.json");
      }
    });
  } catch (error) {
    console.error("Error creating chat completion:", error);
  }
}

// Call the function
createChatCompletion();
