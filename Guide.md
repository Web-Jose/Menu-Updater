# Guide to using 'Weekly Dining Hall Menu Updater'

## Overview

The **Weekly Dining Hall Menu Updater** is a project designed to automatically update the [Dining Hall Menu](https://fresnostatehousing.org/dining-hall-menu/) page on the Fresno State Housing website by fetching the current week's menu from the [Fresno State University Dining Services](https://auxiliary.fresnostate.edu/association/dining/dining-hall/dining-menus.html) page, parsing it into a JSON object, and then uploading it to the Housing website's database. The project is divided into multiple components, including fetching the menu PDF, converting it to JSON using the ChatGPT API, and updating the website's database with the new menu data. The project is designed to be run as a cron job, but it can also be run manually. It is also designed to work specifically with the Fresno State Housing website and the [Pods Framework](https://wordpress.org/plugins/pods/), but it can be modified to work with other websites that use [WordPress.org](https://wordpress.org/).

## Table of Contents

1. [Overview](#Overview)
2. [Table of Contents](#Table-of-Contents)
3. [Before You Begin](#Before-You-Begin)
4. [How to Use](#How-to-Use)
5. [How it Works](#How-it-Works)
6. [Future Plans](#Future-Plans)
7. [Resources](#Resources)
8. [Credits](#Credits)
9. [Conclusion](#Conclusion)

## Before You Begin

Before you begin using the **Weekly Dining Hall Menu Updater**, you will need to have or install the following your computer:

- [Dynamic Dining Hall Menu Integration](https://fresnostatehousing.org/dining-hall-menu/)
  - The **Weekly Dining Hall Menu Updater** is a tool I built with the intention of autonomizing my work on the **Dynamic Dining Hall Menu Integration** project. The **Dynamic Dining Hall Menu Integration** is a project I built for the Fresno State Housing website that allows the website to display the current week's menu on the [Dining Hall Menu](https://fresnostatehousing.org/dining-hall-menu/) page. While it can be modified to work with other projects, ensuring you have the code from the **Dynamic Dining Hall Menu Integration** project in the **functions.php** and **custom_shortcodes.php** files will make it easier to use the **Weekly Dining Hall Menu Updater**.
  - You can find the code for the **Dynamic Dining Hall Menu Integration** project here: https://github.com/Web-Jose/Dynamic-Dining-Hall-Menu-Integration
- [Install Node.js](https://nodejs.org/en/download/)
  - Node.js is a JavaScript runtime environment that allows you to run JavaScript code outside of a web browser. It is required to run the **Weekly Dining Hall Menu Updater**.
- [Node.js Packages](https://docs.npmjs.com/about-packages-and-modules)
  1. Install Axios:
     - Axios is a promise-based HTTP client for the browser and Node.js. Open your terminal or command prompt and navigate to your project directory. Then run the following command:
     ```bash
     npm install axios
     ```
  2. Install PDF-Parse:
     - PDF-Parse is a library for extracting text content from PDF files. Run the following command:
     ```bash
     npm install pdf-parse
     ```
  3. Install OpenAI:
     - OpenAI is a library for interacting with the OpenAI API. Run the following command:
     ```bash
     npm install openai
     ```
- [OpenAI API Key](https://platform.openai.com/account/api-keys)
  - Since you're using the ChatGPT API, you'll need an OpenAI API key. If you don't have one, you can sign up for an account on the OpenAI platform and obtain an API key from there.
- [Text Editor or IDE](https://aws.amazon.com/what-is/ide/)
  - You'll need a text editor or integrated development environment (IDE) to edit the code. I recommend using [Visual Studio Code](https://code.visualstudio.com/), but you can use any text editor or IDE you want.
- [Git (Opional, but Recommended)](https://git-scm.com/)
  - Git is a version control system that allows you to track changes to your code. Having Git installed will make it easier to manage and update your codebase and repositories. You can download Git from: https://git-scm.com/downloads
- [GitHub Repository (Optional, for JSON Data)](https://docs.github.com/en/get-started/quickstart/create-a-repo)
  - If you want to store the JSON data in a GitHub repository, you'll need to create a repository on GitHub. You can create a repository by following the instructions here: https://docs.github.com/en/get-started/quickstart/create-a-repo
- [Github Actions (Optional, for Cron Job)](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions)
  - If you want to upload the **Menu.json** as a cron job, you'll need to create a GitHub Actions workflow. You can create a workflow by following the instructions here: https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions
- [Windows Operating System (for .bat file execution)](https://www.microsoft.com/en-us/windows)
  - If you want to run the **Weekly_Dining_Hall_Menu_Updater.bat** file, you'll need to be running Windows. If you're running a different operating system, you can still run the **Menu_PDF_To_JSON.js** file using Node.js.
- [WordPress.org Website](https://wordpress.org/)
  - If you want to update the database of a WordPress.org website, you'll need to have a WordPress.org website. You can create a WordPress.org website by following the instructions here: https://wordpress.org/support/article/how-to-install-wordpress/
- [Pods Framework Plugin (Database)](https://wordpress.org/plugins/pods/)
  - If you want to update the database of a WordPress.org website, you'll need to have the Pods Framework plugin installed on your website. You can install the Pods Framework plugin by following the instructions here: https://wordpress.org/plugins/pods/
- [WP Crontrol Plugin (Cron Job)](https://wordpress.org/plugins/wp-crontrol/)
  - If you want to update the **Dining_Hall_menu** pod as a cron job, you'll need to have the WP Crontrol plugin installed on your website. You can install the WP Crontrol plugin by following the instructions here: https://wordpress.org/plugins/wp-crontrol/

## How to Use

Follow the steps below to use the **Weekly Dining Hall Menu Updater** to update the [Dining Hall Menu](https://fresnostatehousing.org/dining-hall-menu/) page:

<!-- I want to write a detailed guide-->

1. Clone the repository to your computer.
   - If you have Git installed, you can clone the repository by running the following command in your terminal or command prompt:
   ```bash
   gh clone https://github.com/Web-Jose/Menu-Updater.git
   ```
   - If you don't have Git installed, you can download the repository as a ZIP file by clicking the green **Code** button at the top of the repository page and then clicking **Download ZIP**. Once the ZIP file has finished downloading, extract the files to your computer.
2. Set up Node.js and the required Node.js packages.
   - If you haven't already, install Node.js and the required Node.js packages by following the instructions in the [Before You Begin](#Before-You-Begin) section.
3. Replace the **OPENAI_API_KEY** in the **Menu_PDF_To_JSON.js** file with your own API key.
   - You can find your API key on the [OpenAI platform](https://platform.openai.com/account/api-keys).
4. Run the **Menu_PDF_To_JSON.js** file using Node.js.
   - Open your terminal or command prompt and navigate to the project directory. Then run the following command:
   ```bash
   node Menu_PDF_To_JSON.js
   ```
5. Upload the **Menu.json** file to a repository.
   - If you want to store the JSON data in a GitHub repository, you'll need to create a repository on GitHub. You can create a repository by following the instructions here: https://docs.github.com/en/get-started/quickstart/create-a-repo
   - If you want to upload the **Menu.json** as a cron job, you'll need to create a GitHub Actions workflow. You can create a workflow by following the instructions here: https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions
6. Change the value of the **$url** variable in the **functions.php** file, found in the **Theme File Editor**, to the URL of the **Menu.json** file.
   - If you're using GitHub, you can find the URL of the **Menu.json** file by clicking on the file in your repository and then clicking the **Raw** button.
   - Save the changes to the **functions.php** file.
7. Use the **WP Crontrol** plugin to schedule the **dining_menu_updater** function to run every week.
   - If you want to update the **Dining_Hall_menu** pod as a cron job, you'll need to have the WP Crontrol plugin installed on your website. You can install the WP Crontrol plugin by following the instructions here: https://wordpress.org/plugins/wp-crontrol/
   - Once you have the WP Crontrol plugin installed, navigate to **Tools > Cron Events** in the WordPress dashboard.
     - Click the **Add New** button.
     - In the **Event Type** field, select **Standard Cron Event**.
     - In the **Hook Name** field, enter **dining_menu_updater**.
     - In the **Next Run** field, enter the date and time you want the function to run.
     - In the **Recurrence** field, enter **weekly**.
     - Click the **Add Event** button.
8. Check the [Dining Hall Menu](https://fresnostatehousing.org/dining-hall-menu/) page to make sure the menu has been updated.
   - If the menu has not been updated, check the **Menu.json** file to make sure it has been updated.
   - If the **Menu.json** file has not been updated, check the **Menu_PDF_To_JSON.js** file to make sure it is working properly.
   - If the **Menu_PDF_To_JSON.js** file is working properly, check the **functions.php** file to make sure it is working properly.
   - Ensure that the variables and field names used in the **Menu_PDF_To_JSON.js** file and the **functions.php** file match the variables and field names used in your website's database.

## How it Works

This is a deep dive into the code of the **Weekly Dining Hall Menu Updater**. If you're not interested in the code, you can skip this section.

### Menu_PDF_To_JSON.js

The **Menu_PDF_To_JSON.js** file is the main file of the **Weekly Dining Hall Menu Updater**. It is responsible for fetching the current week's menu from the [Fresno State University Dining Services](https://auxiliary.fresnostate.edu/association/dining/dining-hall/dining-menus.html) page, converting it to JSON using the ChatGPT API, and then updating the **Menu.json** file with the new menu data. The file is divided into multiple sections, each of which is responsible for a different part of the process.

**Section 1: Importing the Required Node.js Packages**

- The first section of the file imports the required Node.js packages. The **axios** package is used to fetch the menu PDF from the [Fresno State University Dining Services](https://auxiliary.fresnostate.edu/association/dining/dining-hall/dining-menus.html) page. The **pdf-parse** package is used to convert the PDF to text. The **openai** package is used to convert the text to JSON using the ChatGPT API.
  - The **axios** package is imported using the following code:
    ```javascript
    const axios = require("axios");
    ```
  - The **pdf-parse** package is imported using the following code:
    ```javascript
    const PDFParser = require("pdf-parse");
    ```
  - The **openai** package is imported using the following code:
    ```javascript
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    ```
  - The **OPENAI_API_KEY** is stored in a **.env** file, which is not included in the repository. You can find your API key on the [OpenAI platform](https://platform.openai.com/account/api-keys).

**Section 2: Fetching the Menu PDF and Extracting the text**

- The second section of the file fetches the menu PDF from the [Fresno State University Dining Services](https://auxiliary.fresnostate.edu/association/dining/dining-hall/dining-menus.html) page. This is done by using the current date to find the date of the past Sunday, which is the first day of the current week. The date of the past Sunday is then used to find the URL of the menu PDF as they follow the format of **menu-(YYYY)-(MM)-(DD).pdf** on the [Fresno State University Dining Services](https://auxiliary.fresnostate.edu/association/dining/dining-hall/dining-menus.html) page. The URL is then used to fetch the menu PDF using the **axios** package. Once the menu PDF has been fetched, the **pdf-parse** package is used to extract the text from the PDF.

  - The date of the past Sunday is found using the following code:
    ```javascript
    function getPastSundayDate() {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 7 : dayOfWeek;
      const pastSunday = new Date(today.setDate(today.getDate() - diff));
      return pastSunday;
    }
    ```
  - The date is formatted using the following code:
    ```javascript
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    ```
  - The URL of the menu PDF is found using the following code:

    ```javascript
    function generateLink() {
      const pastSunday = getPastSundayDate();
      const formattedDate = formatDate(pastSunday);
      const link =
        "https://auxiliary.fresnostate.edu/association/dining/documents/rdh_menus/menu-" +
        formattedDate +
        ".pdf";
      return link;
    }
    ```

  - The menu PDF is fetched and the text is extracted using the following code:
    ```javascript
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
    ```

**Section 3: Converting the Text to JSON**

- The third section of the file converts the text to JSON using the ChatGPT API. The ChatGPT API is a natural language processing model that can be used to convert text to JSON. The ChatGPT API is used to convert the text to JSON by using the **openai** package to send a request to the ChatGPT API. The request includes the text to be converted and the prompt to be used. The prompt is a string of text that is used to tell the ChatGPT API what to do with the text. The prompt used in this section is **"Convert the following text to JSON:"**. The response from the ChatGPT API is then used to update the **Menu.json** file.

  - The prompt to include in the request is generated using the following code:

    ```javascript
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
    ```

  - The request is sent to the ChatGPT API using the following code:

    ```javascript
    async function createChatCompletion() {
      try {
        const prompt = await GeneratePrompt(); // Wait for the prompt text to be generated
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are given a list of meals for each day of the week. Your task is to convert this information into a JSON format following a specific structure. Each day of the week will be represented as a key in the JSON object, using the word form (e.g., Sunday, Monday, Tuesday, etc.). For each day, there will be four sub-keys: Breakfast, Lunch, Dinner, and Dessert. The value corresponding to each sub-key will be an array containing individual dishes served during that meal. Each dish should be represented as a dictionary, where the type of dish (e.g., Entrée, Side 1, Side 2, Protein, etc.) will serve as the key, and the actual dish's name will be the value. Please note the following guidelines: If a meal includes multiple dishes of the same type (e.g., two different side dishes), use numbers to differentiate them (e.g., Side 1, Side 2). Before creating the JSON representation, please ensure to perform a spell check on the provided information to correct any grammatical mistakes or misspellings. Your JSON output should adhere to this structure for every day of the week, including all meal types.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 2048,
        });
    ```

  - The response from the ChatGPT API is used to update the **Menu.json** file using the following code:

    ```javascript
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
    ```

  - This closes the **createChatCompletion** function
    ```javascript
      } catch (error) {
        console.error("Error creating chat completion:", error);
      }
    }
    ```
  - To run the **createChatCompletion** function, use the following code:
    ```javascript
    createChatCompletion();
    ```

**Section 4: Updating the Dining_Hall_menu Pod**
