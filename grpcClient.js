import { credentials } from "@grpc/grpc-js";
import { loadProto } from "./src/utils/loadProto.js";
import { config } from "dotenv";

config();

const loadClient = (app) => {
    console.log("Loading gRPC clients...");
    const billingProto = loadProto("billing");
    app.locals.billingClient = new billingProto.BillingService(
        process.env.BILLING_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Billing client loaded successfully");
    // const videoProto = loadProto("video");
    // app.locals.videoClient = new videoProto.VideoService(
    //     process.env.VIDEO_SERVICE_URL,
    //     credentials.createInsecure()
    // );
    // console.log("Video client loaded successfully");
};

export default loadClient;
