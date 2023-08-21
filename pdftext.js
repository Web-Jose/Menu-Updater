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
  const link =
    "https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-" +
    formattedDate +
    ".pdf";
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
    console.error("Error fetching or parsing the PDF:", error);
    throw error;
  }
}

/*
// Example usage
fetchAndExtractText()
  .then((text) => {
    console.log(text);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
  */

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
            "You are given a list of meals for each day of the week. Your task is to convert this information into a JSON format following a specific structure. Each day of the week will be represented as a key in the JSON object, using the word form (e.g., Sunday, Monday, Tuesday, etc.). For each day, there will be four sub-keys: Breakfast, Lunch, Dinner, and Dessert. The value corresponding to each sub-key will be an array containing individual dishes served during that meal. Each dish should be represented as a dictionary, where the type of dish (e.g., Entrée, Side 1, Side 2, Protein, etc. [They are found listed a long side the menu items]) will serve as the key, and the actual dish's name will be the value. Please note the following guidelines: If a meal includes multiple dishes of the same type (e.g., two different side dishes), use numbers to differentiate them (e.g., Side 1, Side 2). Before creating the JSON representation, please ensure to perform a spell check on the provided information to correct any grammatical mistakes or misspellings. Your JSON output should adhere to this structure for every day of the week, including all meal types. Soup Station should be included as a sub-key for Lunch and Dinner.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });
    // Extract the output message from the API response
    const outputMessage = completion.data.choices[0].message;

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
  /*
    console.log(completion.data.choices[0].message);
  } catch (error) {
    console.error("Error creating chat completion:", error);
  }*/
}

// Call the function
createChatCompletion();
