import CaptainPayload from "./captainPayload.js";

declare module 'express-serve-static-core' {
    interface Request {
        captain?: CaptainPayload
    }
}
