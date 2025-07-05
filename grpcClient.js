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
    const videoProto = loadProto("video");
    app.locals.videoClient = new videoProto.VideoService(
        process.env.VIDEO_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Video client loaded successfully");
    const usersProto = loadProto("users");
    app.locals.usersClient = new usersProto.UsersService(
        process.env.USER_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Users client loaded successfully");
    const playlistProto = loadProto("playlist");
    app.locals.playlistClient = new playlistProto.PlaylistService(
        process.env.PLAYLIST_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Playlist client loaded successfully");

    const socialProto = loadProto("social");
    app.locals.socialClient = new socialProto.SocialInteractions(
        process.env.SOCIAL_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Social client loaded successfully");

    const monitoringProto = loadProto("monitoring");
    app.locals.monitoringClient = new monitoringProto.MonitoringService(
        process.env.MONITORING_SERVICE_URL,
        credentials.createInsecure()
    );
    console.log("Monitoring client loaded successfully");
    
};

export default loadClient;
