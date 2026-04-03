import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";

const client = new KinesisClient({
  region: "ap-south-1",
});

const STREAM_NAME = "chat-stream";

export const sendMessageToKinesis = async (data) => {
  try {
    const params = {
      StreamName: STREAM_NAME,
      Data: Buffer.from(JSON.stringify(data)),
      PartitionKey: data.receiverId.toString(), //  CRITICAL FIX
    };

    await client.send(new PutRecordCommand(params));

    console.log(" Successfully sent to Kinesis");

  } catch (error) {
    console.error(" Kinesis Producer Error:", error);
  }
};