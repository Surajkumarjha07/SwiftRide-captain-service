import CaptainPayload from "./src/types/captainPayload.js";

declare module 'express-serve-static-core' {
    interface Request {
        captain?: CaptainPayload
    }
}
