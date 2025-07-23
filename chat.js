document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.querySelector(".message-list");
    const chatForm = document.querySelector(".chat-form");
    const chatTextarea = document.querySelector(".chat-textarea");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    
    // Load saved theme from localStorage
    const currentTheme = localStorage.getItem("theme") || "dark-theme";
    body.classList.add(currentTheme);
    
    // Update button icon based on theme
    themeToggle.textContent = currentTheme === "dark-theme" ? "🌞 Light Mode" : "🌙 Dark Mode";
    
    themeToggle.addEventListener("click", function () {
        if (body.classList.contains("dark-theme")) {
            body.classList.replace("dark-theme", "light-theme");
            themeToggle.textContent = "🌙 Dark Mode";
            localStorage.setItem("theme", "light-theme");
        } else {
            body.classList.replace("light-theme", "dark-theme");
            themeToggle.textContent = "🌞 Light Mode";
            localStorage.setItem("theme", "dark-theme");
        }
    });
    
    // Function to format AI response with proper spacing
    function formatAIResponse(text) {
        document.addEventListener("DOMContentLoaded", function () {
            function formatTextWithSpacing(text) {
                return text.replace(/\*\s/g, "\n• ");
            }
            
            const paragraphs = document.querySelectorAll(".container p, .container li");
            paragraphs.forEach(paragraph => {
                paragraph.textContent = formatTextWithSpacing(paragraph.textContent);
            });
        });
        return text.replace(/\* /g, "  ").replace(/\n/g, "\n\n");
    }
    
    // Function to create chat bubbles
    function createChatBubble(message, sender) {
        let div = document.createElement("div");
        div.classList.add("message", sender);
        div.textContent = message;
        chatContainer.appendChild(div);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
    
    async function fetchAIResponse(userMessage) {
        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDZuQrTr3Lh_D1LdLcDTdKjF0uk7DiqK50";
    
        const requestBody = {
            contents: [{ parts: [{ text: userMessage }] }]
        };
    
        try {
            let response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            let data = await response.json();
            let aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
            createChatBubble(formatAIResponse(aiResponse), "assistant");
        } catch (error) {
            createChatBubble("Error: Unable to get response. Try again later.", "assistant");
        }
    }
    
    function handleUserMessage(event) {
        event.preventDefault();
        let userMessage = chatTextarea.value.trim();
        if (userMessage === "") return;
    
        createChatBubble(userMessage, "user");
        chatTextarea.value = "";
        fetchAIResponse(userMessage);
    }
    
    chatForm.addEventListener("submit", handleUserMessage);
    
    chatTextarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = `${this.scrollHeight}px`;
    });
});
