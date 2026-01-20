import { AccessToken } from "livekit-server-sdk";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const roomName = req.nextUrl.searchParams.get("roomName") || "interview-room-" + Math.random().toString(36).substring(7);
    const participantName = req.nextUrl.searchParams.get("participantName") || "user-" + Math.random().toString(36).substring(7);
    const interviewType = req.nextUrl.searchParams.get("interviewType") || "Behavioral";

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
        return NextResponse.json(
            { error: "Server misconfigured" },
            { status: 500 }
        );
    }

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
        }
    );

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });

    // Set metadata on the token for the participant
    at.metadata = JSON.stringify({
        interview_type: interviewType
    });

    return NextResponse.json({
        token: await at.toJwt(),
        url: process.env.LIVEKIT_URL,
        roomName,
    });
}
