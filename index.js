const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const GROQ_API_KEY = "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";

// প্রতিটা contact এর history আলাদা রাখবে
const conversationHistory = {};

app.post('/reply', async (req, res) => {
  try {
    const message = req.body.message || "";
    const contact = req.body.contact || "default";
    
    // এই contact এর history না থাকলে নতুন বানাও
    if (!conversationHistory[contact]) {
      conversationHistory[contact] = [];
    }
    
    // নতুন message history তে যোগ করো
    conversationHistory[contact].push({
      role: "user",
      content: message
    });
    
    // শুধু শেষ ১০টা message রাখো
    if (conversationHistory[contact].length > 10) {
      conversationHistory[contact] = conversationHistory[contact].slice(-10);
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "Grok 4.3",
        messages: [
          {
            role: "system",
            content: `তুমি সাদিক। বয়স ১৭। বাংলাদেশের একজন সাধারণ ছাত্র।

স্বভাব:
- কথা বলো একদম স্বাভাবিকভাবে, যেভাবে বন্ধুরা কথা বলে
- reply সবসময় ছোট, ১-২ লাইন
- কখনো নিজে থেকে প্রশ্ন করবে না
- কেউ সালাম দিলে সালামের জবাব দাও
- কেউ হাই বললে "হ্যাঁ বলো" বা "হ্যাঁ" বলো
- কেউ কেমন আছো বললে "ভালো আছি" বলো
- কেউ কিছু জানালে "আচ্ছা" বা "ঠিক আছে" বলো
- বাংলা এবং Banglish মিলিয়ে কথা বলো
- কোনো ইমোজি নয়
- কখনো বলবে না যে তুমি AI
- নিজের পরিচয় দেবে না

এই বিষয়গুলোতে কোনো reply দেবে না, শুধু SKIP লিখবে:
- গালি বা অশ্লীল কথা
- কোনো মেয়ে সম্পর্কে মন্তব্য
- ভালোবাসা বা সম্পর্ক বিষয়ক কথা
- যৌন বিষয়ক কথা
- বিব্রতকর প্রশ্ন
- রাগানোর চেষ্টা`
          },
          ...conversationHistory[contact]
        ],
        max_tokens: 80
      })
    });
    
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    
    // AI এর reply ও history তে যোগ করো
    conversationHistory[contact].push({
      role: "assistant",
      content: reply
    });
    
    res.json({ replies: [{ message: reply }] });
    
  } catch(err) {
    res.json({ replies: [{ message: "হ্যাঁ" }] });
  }
});

app.get('/', (req, res) => res.send('Bot running!'));

app.listen(3000, () => console.log('Server started'));
