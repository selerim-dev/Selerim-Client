import { NextResponse } from "next/server";
export function POST() {
  return NextResponse.json(
    {
      error:
        "The strategy preview has been retired. Request an AI Opportunity Audit at /contact.",
    },
    { status: 410 },
  );
}
export const GET = POST;
