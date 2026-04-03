import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";

const client = new KinesisClient({
  region: "ap-south-1",
});

export const sendMessageToKinesis = async (message) => {
    console.log("🚀 Sending message to Kinesis:", message);
  const command = new PutRecordCommand({
    StreamName: "chat-stream",
    Data: JSON.stringify(message),
    PartitionKey: message.userId || "default",
  });

  await client.send(command);
};