import CaptainPayload from "./types/actionPayload.type.js";

declare module 'express-serve-static-core' {
    interface Request {
        captain: CaptainPayload
    }
}
