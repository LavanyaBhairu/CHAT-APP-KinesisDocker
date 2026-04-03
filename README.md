# Real-Time Chat Application using AWS Kinesis & Docker

## Overview

This project is a **real-time chat application** built using an **event-driven architecture** powered by **AWS Kinesis**, **Node.js**, **MongoDB Atlas**, and **WebSockets**.

It demonstrates how modern scalable systems process and stream data asynchronously using cloud-native services.

---

## Architecture Summary

* Frontend (React + Vite)
* Backend (Node.js + Express + Socket.IO)
* AWS Kinesis (Streaming service)
* MongoDB Atlas (Database)
* Docker (Containerization)

---

```## Architecture Diagram

Frontend (React/Vite)
        │
        ▼
Backend (Node.js + Express)
        │
        ▼
AWS Kinesis Stream
        │
        ▼
Kinesis Consumer (Polling)
        │
        ├──> MongoDB Atlas (Store Messages)
        │
        └──> Socket.IO (Real-time delivery)

### Flow Explanation

1. User sends message from frontend  
2. Backend sends message to AWS Kinesis  
3. Consumer reads messages from Kinesis  
4. Messages are stored in MongoDB  
5. If receiver is online → sent via WebSocket  
---
## Tech Stack

### Frontend

* React (Vite)
* Socket.IO Client
* Tailwind CSS + DaisyUI

### Backend

* Node.js
* Express.js
* Socket.IO
* AWS SDK (Kinesis)

### Cloud & Infra

* AWS Kinesis Data Streams
* MongoDB Atlas
* Docker & Docker Compose

---

## How It Works

1. User sends message from UI
2. Backend receives request
3. Message is pushed to AWS Kinesis
4. Kinesis Consumer polls and processes message
5. Message is:

   * Stored in MongoDB
   * Sent to receiver via WebSocket (if online)

---

## Project Structure

```
CHAT-APP - KinesisDocker/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── socket/
│   ├── kinesisConsumer.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## Running with Docker

### 1. Clone repo

```bash
git clone <repo-url>
cd CHAT-APP - KinesisDocker
```

### 2. Start application

```bash
docker-compose up --build
```

### 3. Access app

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

##  Environment Variables

Create `.env` inside backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
KINESIS_STREAM_NAME=chat-stream
```

---

## Key Features

* ✅ Event-driven architecture using Kinesis
* ✅ Real-time messaging with WebSockets
* ✅ Scalable streaming pipeline
* ✅ Dockerized microservices setup
* ✅ MongoDB Atlas integration

---

## Known Behavior

* If receiver is offline:

  * Message is stored in DB
  * Not delivered via socket immediately

---

## Future Improvements

* Replace polling with AWS Lambda (serverless consumer)
* Add message delivery status (seen/sent)
* Scale using multiple Kinesis shards
* Deploy to AWS ECS / EC2 with Nginx

---

## Learning Outcomes

* Event-driven systems using Kinesis
* Docker container orchestration
* Real-time communication using Socket.IO
* Debugging distributed systems

---

## Author
Lavanya B
Lavanya B
Full Stack Developer → AWS & Cloud Enthusiast
