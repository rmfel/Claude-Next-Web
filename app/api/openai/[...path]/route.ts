import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

const role_map = {
  system: "Human",
  user: "Human",
  assistant: "Assistant",
};

function convertMessagesToPrompt(messages: any) {
  let prompt = "";
  for (const message of messages) {
    const role = message["role"];
    const content = message["content"];
    const transformed_role = role_map[role] || "Human";
    prompt += `\n\n${transformed_role}: ${content}`;
  }
  prompt += "\n\nAssistant: ";
  return prompt;
}

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestOpenai(req);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
