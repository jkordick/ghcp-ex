import express from "express";
import { Octokit } from "@octokit/core";
import { createTextEvent, createDoneEvent } from '@copilot-extensions/preview-sdk';

const app = express()

app.get("/", (request, response) => {
    response.send("Julia's GHCP Extension is running.");
});

app.post("/", express.json(), async (request, response) => {
    let username = "user";
    const tokenForUser = request.get("X-GitHub-Token");
    if (tokenForUser) {
        const octokit = new Octokit({ auth: tokenForUser });
        
        try {
            user = await octokit.request("GET /user");
            username = user.data.login;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    // Parse the request payload and log it.
    const payload = request.body;
    console.log("Payload:", payload);

    const messages = payload.messages;
    const lastMessage = messages[messages.length - 1].content;

    // Process message and response
    const newMessage = `Hello, ${username}! You said: "${lastMessage}"`;
    console.log("Response: " + newMessage);

    response.write(createTextEvent(newMessage));
    response.end(createDoneEvent());
});

const port = Number(process.env.PORT || '3000')
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});