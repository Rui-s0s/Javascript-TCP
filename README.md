# 🌐 Simple TCP Chat Socket

A lightweight, multi-client chat application built with Node.js using the native `net` module. This project demonstrates basic TCP socket communication, message broadcasting, and terminal-based user interaction.

## 🚀 Features

*   **Multi-Client Support:** Handles up to 100 simultaneous connections.
*   **Real-time Broadcasting:** Messages sent by one client are instantly broadcasted to all other connected peers.
*   **Automatic ID Assignment:** Every client is assigned a unique 4-digit identifier (e.g., `User 0001`) upon connection.
*   **Server Controls:** The server administrator can broadcast messages to all users or shut down the server gracefully.
*   **Robust Input Handling:** Includes a "safe logging" mechanism to prevent incoming messages from interrupting the user's current typing in the terminal.
*   **Safety Limits:** Prevents server overload with client limits and enforces a 300-character limit per message.

## 🛠 Prerequisites

*   [Node.js](https://nodejs.org/) (v12 or higher recommended)

## 📖 Usage

### 1. Start the Server
Run the server first to begin listening for incoming connections:
```bash
node server.js
```

### 2. Connect Clients
Open a new terminal window for each client you want to connect:
```bash
node client.js
```

### 3. Chatting
*   Type your message in the client terminal and press **Enter** to send.
*   Type `exit` in the client terminal to disconnect safely.
*   Type `exit` in the server terminal to shut down the entire chat room.

## 🏗 Architecture

*   **`server.js`**: Manages the socket lifecycle, tracks connected clients, handles broadcasting logic, and enforces security constraints.
*   **`client.js`**: Connects to the server, provides a clean CLI for user input, and renders incoming messages from the network.

---
*"Connecting the performance of low-level networking with the simplicity of JavaScript."*
