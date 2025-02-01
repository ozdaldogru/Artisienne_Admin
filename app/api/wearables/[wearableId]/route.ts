import Wearable from "@/lib/models/Wearable";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ wearableId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const wearable = await Wearable.findById(params.wearableId);

    if (!wearable) {
      return new NextResponse(
        JSON.stringify({ message: "Wearable not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(wearable), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[wearableId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ wearableId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const wearable = await Wearable.findById(params.wearableId);

    if (!wearable) {
      return new NextResponse(
        JSON.stringify({ message: "Wearable not found" }),
        { status: 404 }
      );
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new wearable", {
        status: 400,
      });
    }

    // Update Wearable
    const updatedWearable = await Wearable.findByIdAndUpdate(
      wearable._id,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await updatedWearable.save();

    return NextResponse.json(updatedWearable, { status: 200 });
  } catch (err) {
    console.log("[wearableId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ wearableId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const wearable = await Wearable.findById(params.wearableId);

    if (!wearable) {
      return new NextResponse(
        JSON.stringify({ message: "Wearable not found" }),
        { status: 404 }
      );
    }

    await Wearable.findByIdAndDelete(wearable._id);

    return new NextResponse(JSON.stringify({ message: "Wearable deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[wearableId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

