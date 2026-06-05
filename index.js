const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const GROQ_API_KEY = "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";

app.post('/reply', async (req, res) => {
  try {
    const message = req.body.message || "";
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model:"llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `তুমি সাদিক, একজন বাংলাদেশি ছাত্র।
সবসময় বাংলায় reply দেবে।
reply সবসময় ছোট এবং natural হবে।
কখনো বলবে না যে তুমি AI।
কোনো ইমোজি ব্যবহার করবে না।
কেউ তথ্য দিলে শুধু "ঠিক আছে" বলবে।
বাংলাদেশি ছাত্রদের ভাষা বুঝবে।
প্রাইভেট মানে টিউশন বা কোচিং ক্লাস।

নিচের যেকোনো ক্ষেত্রে শুধু SKIP লিখবে:
- যেকোনো গালি
- ছাগল পাগল বোকা অসভ্য এই ধরনের কথা
- অশ্লীল বা যৌন কোনো কথা
- কোনো মেয়ে সম্পর্কে যেকোনো মন্তব্য
- সম্পর্ক বা ভালোবাসা বিষয়ক কথা
- বিব্রতকর যেকোনো প্রশ্ন
- provoke বা রাগানোর চেষ্টা`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 100
      })
    });
    
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    res.json({ replies: [{ message: reply }] });
    
  } catch(err) {
    res.json({ replies: [{ message: "ঠিক আছে" }] });
  }
});

app.get('/', (req, res) => res.send('Bot running!'));

app.listen(3000, () => console.log('Server started'));
