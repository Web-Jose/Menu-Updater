const axios = require("axios"); // Import the axios module for making HTTP requests
const PDFParser = require("pdf-parse"); // Import the PDF parser module
const fs = require("fs"); // Import the Node.js file system module
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

const targetText = `University Dining Services makes every effort to ensure the items listed on our menus are up to date and correct. However, the items listed are not a guarantee and are subject to change without notice Dinner Action Stations are available from 4pm-7pm, or until the special runs out Lunch Feature Stations are available from 11am-2pm, or until the special runs out Please also see our Fixed Menu for the complete list of items we carry each day`;

// Function to fetch the PDF and extract text
async function fetchAndExtractText() {
  try {
    const link = generateLink();
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const data = response.data;
    const pdf = await PDFParser(data);
    let text = pdf.text.replace(/\s+/g, ", "); // Replace multiple spaces with a single space
    text = text.replace(targetText, ""); // Remove the target text
    text = text.replace(/(\w)([A-Z])/g, "$1 $2"); // Add space between words and capital letters
    text = text.replace(/(\d{4})(\d{1,2})/g, "$1 $2"); // Add space after the fourth digit for 5 or 6-digit numbers
    text = text.replace(/([a-zA-Z])(\d)/g, "$1 $2"); // Add space between letters and numbers
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
            "You are presented with a PDF containing a weekly menu for a university dining hall. Your objective is to accurately convert this menu into a structured JSON format. Here are your detailed instructions: Days of the Week: The days of the week are provided as 'Sunday', 'Monday', 'Tuesday', etc. These should serve as the primary keys in the JSON structure. Meal Components: Each day should have distinct sub-keys for 'Breakfast', 'Lunch', 'Dinner', and 'Dessert'. Ensure each meal adheres to the following guidelines: Breakfast: Typically includes 1 'Entrée', 2 'Sides', and 1 'Protein'. The sides should be labeled as 'Side 1' and 'Side 2'. Lunch: Generally, includes 1 'Entrée', 1 'Vegan Entrée', 1 'Side', and 1 'Vegetable'. May optionally include a 'Feature Station' and 'Soup Station' with distinct keys like 'Soup Option 1', 'Soup Option 2' for different soup choices. Dinner: May have multiple dishes like 'Entrée', 'Vegan Entrée', 'Side', 'Vegetable', etc. If there are multiple dishes of the same type within a meal, label them sequentially, e.g., 'Entrée 1', 'Entrée 2'. Dessert: This should be its own category, formatted as:Dessert: { Specialty Dessert: Dessert Name } Multiple Dishes: If there are multiple dishes of the same type within a meal, label them sequentially, e.g., 'Entrée 1', 'Entrée 2'. Soup Station: Ensure 'Soup Station' is ONLY included in the 'Lunch' section and NOT in the 'Dinner' section. Feature vs. Soup Station: Differentiate between 'Feature Station' and 'Soup Station'. They are not the same and should be treated as separate sub-keys. Correctness: It's crucial to ensure the output is free from errors. Avoid misplacing items and ensure there are no grammatical or spelling mistakes. Using these guidelines, please transform the provided PDF content into a structured JSON format.",
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
