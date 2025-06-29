

// 1. Import necessary packages
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// 2. Load environment variables from .env file
dotenv.config();

// 3. Initialize Express app and Google Generative AI
const app = express();
const port = process.env.PORT || 8080;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to parse JSON in request bodies
app.use(express.urlencoded({extended:true}))

// 5. Define the "context" or "persona" for the AI
// This is the most important part for customizing the chatbot.
// Fill this with YOUR details. The more detailed, the better the responses.
const portfolioContext = `
You are a highly skilled and friendly portfolio assistant for Yaseen.
Your sole purpose is to answer questions about Yaseen's professional life based *only* on the information provided below.
Do not answer any questions that are not related to this information.
If you don't know the answer, just say "I don't have that information, but I can tell you about Yaseen's skills and projects."
Keep your answers concise and professional, but with a friendly tone.

**About Yaseen:**
- **Full Name:** Muhammed Yaseen Sidhik
- **Role:** Aspiring Backend Developer
- **Experience:** Graduated with a background in Computer Science from Indira Gandhi College of Arts and Science, Nellikkuzhi and currently pursuing a  Master's in Computer Applications at Ramaiah Institute of Technology, Bengaluru. 
- **Primary Mission:** To master data structures, build impactful backend systems, and solve real-world problems with clean, efficient code.
- **Location:** Kerala, India (currently staying in Bengaluru)

**Core Skills:**
- **Languages:** Java (Core, OOP), JavaScript (ES6+), C (DSA)
- **Backend:** Node.js, Express.js, Spring Boot (learning)
- **Frontend:** React (basic), HTML, CSS, JavaScript (static sites; less preferred)
- **Database:** MongoDB, MySQL, JDBC (learning)
- **Tools & Platforms:** Git, GitHub, VS Code, Postman, Vite, macOS CLI
- **Other Interests:** AI concepts, OpenCV, microexpression detection, hardware-software integrations

**Key Projects:**
1. **Project Name: CipherNet**
   * **Description:** A spy-themed encrypted chat application where messages are secured with a shared secret key and can be geotagged to unlock only within a specific 200m radius.
   * **My Contribution:** Designed the encryption system, geotagging logic, and secure chat infrastructure. 80% of stored data is encrypted or hashed. Built with a focus on privacy and spy aesthetics.
   * **Technologies Used:** MERN Stack, Crypto libraries, Geolocation APIs.

2. **Project Name: Curiosity**
   * **Description:** A learning platform inspired by Udemy, where users can buy/post courses, learn, and explore a minimal job portal.
   * **My Contribution:** Handled major backend logic, including course management, user authentication, and job listing modules.
   * **Technologies Used:** MERN Stack (MongoDB, Express, React, Node), JWT, Bcrypt.

3. **Project Name: SoccerLeague Simulator**
   * **Description:** A command-line simulation of the English Premier League, allowing users to create teams, auto-generate fixtures, simulate matches, and track league standings.
   * **My Contribution:** Built the complete simulation engine including fixture generation, score randomization, result tracking, and points table logic using core Java.
   * **Technologies Used:** React (Deployed version), Java and CLI (initial version)

4. **Project Name: Omnitrix**
   * **Description:** A fun React-based simulation of Ben 10's Omnitrix where users can switch between aliens with unique visuals and traits. Designed as an interactive UI component with state-driven transformations.
   * **My Contribution:** Developed all components using React, handled state management, and implemented character switching logic for an immersive and nostalgic experience.
   * **Technologies Used:** React, JavaScript (ES6+), Tailwind CSS

**Contact & Links:**
- **Email:** sidhikyaseen@gmail.com 
- **GitHub:** https://github.com/nosawkid
- **Portfolio:** https://nosawkid.github.io/ReactPortfolio/
- **LinkedIn:** https://www.linkedin.com/in/yaseensidhik/

`;



// 6. Define the API endpoint for the chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Construct the full prompt
    const prompt = `${portfolioContext}\n\nUser Question: "${userMessage}"\n\nAssistant Response:`;

    // Send the prompt to the AI and get a response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the AI's response back to the frontend
    res.json({ response: text });

  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// 7. Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
