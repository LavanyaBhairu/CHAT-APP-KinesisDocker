import {
  KinesisClient,
  GetShardIteratorCommand,
  GetRecordsCommand,
} from "@aws-sdk/client-kinesis";

import { io, getReceiverSocketId } from "./socket/socket.js";

const client = new KinesisClient({
  region: "ap-south-1",
});

const STREAM_NAME = "chat-stream";

// Prevent multiple consumers
let isConsumerRunning = false;

export const startKinesisConsumer = async () => {
  if (isConsumerRunning) {
    console.log("Kinesis consumer already running");
    return;
  }

  isConsumerRunning = true;

  try {
    // Step 1: Get shard iterator
    const shardIteratorResponse = await client.send(
      new GetShardIteratorCommand({
        StreamName: STREAM_NAME,
        ShardId: "shardId-000000000000",
        ShardIteratorType: "LATEST",
      })
    );

    let shardIterator = shardIteratorResponse.ShardIterator;

    console.log("Kinesis Consumer Started...");

    // Step 2: Poll records continuously
    setInterval(async () => {
      try {
        const response = await client.send(
          new GetRecordsCommand({
            ShardIterator: shardIterator,
            Limit: 10,
          })
        );

        shardIterator = response.NextShardIterator;

        const records = response.Records || [];

        if (records.length > 0) {
          console.log(`📥 Received ${records.length} messages from Kinesis`);
        }

        // Step 3: Process each record safely
        records.forEach((record) => {
          try {
            const data = JSON.parse(
              Buffer.from(record.Data).toString()
            );
            console.log("📦 Kinesis Data Received:", data);

            // Validate message structure
            if (!data || !data.receiverId) return;

            // Handle event types (future-ready)
            if (data.type === "NEW_MESSAGE") {
              const receiverSocketId = getReceiverSocketId(data.receiverId);

              if (receiverSocketId) {
                console.log(`📤 Sending message to ${data.receiverId}`);
                io.to(receiverSocketId).emit("newMessage", data);
              }
            }

          } catch (err) {
            console.error("❌ Failed to process record:", err);
          }
        });

      } catch (error) {
        console.error("❌ Polling error:", error);
      }
    }, 2000); // poll every 2 seconds

  } catch (error) {
    console.error("❌ Kinesis Consumer Initialization Error:", error);
  }
};