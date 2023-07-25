const axios = require("axios");
const PDFParser = require("pdf-parse");
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
            "Convert the table provided to JSON. The structure of the JSON will be as follows: Each day of the week will be a key (word form). Each meal (Breakfast, Lunch, Dinner, Dessert) will be a sub-key. Each sub-key will have an array of dishes, where each dish is a dictionary with the type of dish (Entrée, Side, Protein, etc.) as the key and the actual dish as the value. Complete for every day of the week.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });
    console.log(completion.data.choices[0].message);
  } catch (error) {
    console.error("Error creating chat completion:", error);
  }
}

// Call the function
createChatCompletion();
