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

let isConsumerRunning = false;

export const startKinesisConsumer = async () => {
  if (isConsumerRunning) {
    console.log("Kinesis consumer already running");
    return;
  }

  isConsumerRunning = true;

  try {
    let shardIterator = await getShardIterator();

    console.log("Kinesis Consumer Started...");

    setInterval(async () => {
      try {
        // Ensure iterator exists
        if (!shardIterator) {
          shardIterator = await getShardIterator();
        }

        const response = await client.send(
          new GetRecordsCommand({
            ShardIterator: shardIterator,
            Limit: 10,
          })
        );

        // Update iterator
        shardIterator = response.NextShardIterator;

        const records = response.Records || [];

        if (records.length > 0) {
          console.log(`Received ${records.length} messages from Kinesis`);
        }

        for (const record of records) {
          try {
            const data = JSON.parse(
              Buffer.from(record.Data).toString()
            );

            console.log("Kinesis Data:", data);

            if (!data || !data.receiverId) continue;

            if (data.type === "NEW_MESSAGE") {
              const receiverSocketId = getReceiverSocketId(data.receiverId);

              if (receiverSocketId) {
                console.log(`Sending message to ${data.receiverId}`);
                io.to(receiverSocketId).emit("newMessage", data);
              }
            }
          } catch (err) {
            console.error("Failed to process record:", err);
          }
        }

      } catch (error) {
        console.error("Polling error:", error.name);

        // Handle expired iterator
        if (error.name === "ExpiredIteratorException") {
          console.log("Refreshing shard iterator...");
          shardIterator = await getShardIterator();
        }
      }
    }, 2000);

  } catch (error) {
    console.error("Kinesis Consumer Initialization Error:", error);
  }
};

// Helper function
const getShardIterator = async () => {
  const response = await client.send(
    new GetShardIteratorCommand({
      StreamName: STREAM_NAME,
      ShardId: "shardId-000000000000",
      ShardIteratorType: "LATEST",
    })
  );

  return response.ShardIterator;
};