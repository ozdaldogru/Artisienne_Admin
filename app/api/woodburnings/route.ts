import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import WoodBurning from "@/lib/models/WoodBurning";


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
      return new NextResponse("Not enough data to create a WoodBurning", {
        status: 400,
      });
    }

    const newWoodBurning = await WoodBurning.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newWoodBurning.save();

    return NextResponse.json(newWoodBurning, { status: 200 });
  } catch (err) {
    console.log("[woodburnings_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const woodburnings = await WoodBurning.find()
      .sort({ createdAt: "desc" })

      

    return NextResponse.json(woodburnings, { status: 200 });
  } catch (err) {
    console.log("[woodburnings_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

