import { NextRequest, NextResponse } from "next/server";

type SeedValidationRequest = {
  walletType?: string;
  wordCount?: number;
  validation?: {
    allLowercaseAlphabetic?: boolean;
    uniqueWordCount?: number;
  };
  context?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SeedValidationRequest;

    if (body.walletType !== "seed") {
      return NextResponse.json(
        { status: "error", message: "Invalid wallet type." },
        { status: 400 }
      );
    }

    if (
      typeof body.wordCount !== "number" ||
      ![12, 15, 24].includes(body.wordCount)
    ) {
      return NextResponse.json(
        { status: "error", message: "Invalid seed word count." },
        { status: 400 }
      );
    }

    if (
      body.validation?.allLowercaseAlphabetic !== true ||
      typeof body.validation?.uniqueWordCount !== "number"
    ) {
      return NextResponse.json(
        { status: "error", message: "Validation metadata is incomplete." },
        { status: 400 }
      );
    }

    const requestId = crypto.randomUUID();

    return NextResponse.json(
      {
        status: "ok",
        message: `Validated ${body.wordCount}-word seed metadata for ${body.context ?? "unknown"} flow`,
        requestId,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request payload." },
      { status: 400 }
    );
  }
}

