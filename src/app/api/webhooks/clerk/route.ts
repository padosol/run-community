import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

// Clerk Webhook Secret (환경변수에서 가져옴)
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email_addresses?: Array<{ email_address: string }>;
    image_url?: string | null;
  };
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook signature
  const wh = new Webhook(webhookSecret);
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // 디버깅: 받은 이벤트 로그
  console.log("Received Clerk webhook event:", event.type);
  console.log("Event data:", JSON.stringify(event.data, null, 2));

  // Handle different event types
  switch (event.type) {
    case "user.created": {
      const {
        id,
        username,
        first_name,
        last_name,
        email_addresses,
        image_url,
      } = event.data;

      // 닉네임 결정: username > first_name + last_name > "User_" + id 앞 6자
      let nickname = username;
      if (!nickname && (first_name || last_name)) {
        nickname = `${first_name || ""} ${last_name || ""}`.trim();
      }
      if (!nickname) {
        nickname = `User_${id.substring(5, 11)}`;
      }

      const email = email_addresses?.[0]?.email_address || null;

      console.log(
        `Creating user: ${id}, nickname: ${nickname}, email: ${email}`
      );

      const { error } = await supabase.from("users").insert({
        clerk_user_id: id,
        nickname,
        avatar_url: image_url || null,
        email,
      });

      if (error) {
        console.error("Error creating user:", error);
        // 이미 존재하면 무시 (UNIQUE constraint)
        if (error.code !== "23505") {
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }
      }

      console.log(`User created successfully: ${id} -> ${nickname}`);
      break;
    }

    case "user.updated": {
      const {
        id,
        username,
        first_name,
        last_name,
        email_addresses,
        image_url,
      } = event.data;

      let nickname = username;
      if (!nickname && (first_name || last_name)) {
        nickname = `${first_name || ""} ${last_name || ""}`.trim();
      }
      if (!nickname) {
        nickname = `User_${id.substring(5, 11)}`;
      }

      const email = email_addresses?.[0]?.email_address || null;

      console.log(
        `[user.updated] id: ${id}, nickname: ${nickname}, email: ${email}, image_url: ${image_url}`
      );

      // 먼저 사용자가 존재하는지 확인
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("id, clerk_user_id, nickname")
        .eq("clerk_user_id", id)
        .single();

      console.log(
        "[user.updated] Existing user:",
        existingUser,
        "Error:",
        selectError
      );

      if (existingUser) {
        // 사용자가 존재하면 UPDATE
        const { data: updateData, error: updateError } = await supabase
          .from("users")
          .update({
            nickname,
            avatar_url: image_url || null,
            email,
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_user_id", id)
          .select();

        console.log(
          "[user.updated] Update result:",
          updateData,
          "Error:",
          updateError
        );

        if (updateError) {
          console.error("Error updating user:", updateError);
        } else {
          console.log(`User updated successfully: ${id} -> ${nickname}`);
        }
      } else {
        // 사용자가 없으면 INSERT
        const { data: insertData, error: insertError } = await supabase
          .from("users")
          .insert({
            clerk_user_id: id,
            nickname,
            avatar_url: image_url || null,
            email,
          })
          .select();

        console.log(
          "[user.updated] Insert result:",
          insertData,
          "Error:",
          insertError
        );

        if (insertError) {
          console.error("Error inserting user:", insertError);
        } else {
          console.log(`User inserted successfully: ${id} -> ${nickname}`);
        }
      }

      break;
    }

    case "user.deleted": {
      const { id } = event.data;

      // 사용자 삭제 시 처리 (선택: 실제 삭제 또는 soft delete)
      // 여기서는 로그만 남김 (게시글/댓글 유지를 위해)
      console.log(`User deleted: ${id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ success: true });
}
