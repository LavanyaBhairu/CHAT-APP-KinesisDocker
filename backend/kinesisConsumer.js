import {
  KinesisClient,
  GetShardIteratorCommand,
  GetRecordsCommand,
  DescribeStreamCommand,
} from "@aws-sdk/client-kinesis";

import { io, getReceiverSocketId } from "./socket/socket.js";
import Message from "./models/message.model.js";

const client = new KinesisClient({
  region: "ap-south-1",
});

const STREAM_NAME = "chat-stream";

let isConsumerRunning = false;

export const startKinesisConsumer = async () => {
  if (isConsumerRunning) {
    console.log(" Kinesis consumer already running");
    return;
  }

  isConsumerRunning = true;

  try {
    let shardIterator = await getShardIterator();

    console.log(" Kinesis Consumer Started...");

    setInterval(async () => {
      try {
        console.log(" Polling Kinesis...");

        if (!shardIterator) {
          console.log(" Shard iterator missing, fetching again...");
          shardIterator = await getShardIterator();
        }

        const response = await client.send(
          new GetRecordsCommand({
            ShardIterator: shardIterator,
            Limit: 10,
          })
        );

        //  IMPORTANT: Always update iterator
        shardIterator = response.NextShardIterator;

        const records = response.Records || [];

        if (records.length > 0) {
          console.log(` Records received: ${records.length}`);

          for (const record of records) {
            try {
              //  Decode raw data
              const rawData = Buffer.from(record.Data).toString();
              console.log(" Raw Data:", rawData);

              //  Parse JSON
              const data = JSON.parse(rawData);
              console.log(" Parsed Message:", data);

              if (!data || !data.receiverId) {
                console.log(" Invalid data, skipping...");
                continue;
              }

              //  HANDLE NEW MESSAGE EVENT
              if (data.type === "NEW_MESSAGE") {
                const receiverSocketId = getReceiverSocketId(data.receiverId);

                if (receiverSocketId) {
                  console.log(` Sending message to user: ${data.receiverId}`);
                  io.to(receiverSocketId).emit("newMessage", data);
                } else {
                  console.log(` User ${data.receiverId} not connected`);
                }
              }

              //  OPTIONAL: Save to MongoDB (if needed)
              // await Message.create(data);

            } catch (err) {
              console.error(" Failed to process record:", err);
            }
          }

        } else {
          console.log(" No records");
        }

      } catch (error) {
        console.error(" Polling error:", error.name);

        if (error.name === "ExpiredIteratorException") {
          console.log(" Iterator expired, refreshing...");
          shardIterator = await getShardIterator();
        }
      }
    }, 2000);

  } catch (error) {
    console.error(" Kinesis Consumer Initialization Error:", error);
  }
};

//  Get shard dynamically
const getShardIterator = async () => {
  try {
    const streamData = await client.send(
      new DescribeStreamCommand({
        StreamName: STREAM_NAME,
      })
    );

    const shardId = streamData.StreamDescription.Shards[0].ShardId;

    console.log(" Using Shard ID:", shardId);

    const response = await client.send(
      new GetShardIteratorCommand({
        StreamName: STREAM_NAME,
        ShardId: shardId,
        ShardIteratorType: "TRIM_HORIZON",
      })
    );

    return response.ShardIterator;

  } catch (error) {
    console.error(" Error getting shard iterator:", error);
    throw error;
  }
};