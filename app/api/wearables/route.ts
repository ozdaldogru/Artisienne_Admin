import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Wearable from "@/lib/models/Wearable";


export const POST = async (req: NextRequest) => {
  try {
    const {userId}  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      title,
      status,
      price,
      description,
      media,
      
    } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a wearable", {
        status: 400,
      });
    }

    const newWearable = await Wearable.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newWearable.save();

    return NextResponse.json(newWearable, { status: 200 });
  } catch (err) {
    console.log("[wearables_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const wearables = await Wearable.find()
      .sort({ createdAt: "desc" })

      

    return NextResponse.json(wearables, { status: 200 });
  } catch (err) {
    console.log("[wearables_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

