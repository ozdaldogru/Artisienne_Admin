import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Drawing from "@/lib/models/Drawing";


export const POST = async (req: NextRequest) => {
  try {
    const {userId}  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a drawing", {
        status: 400,
      });
    }

    const newDrawing = await Drawing.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newDrawing.save();

    return NextResponse.json(newDrawing, { status: 200 });
  } catch (err) {
    console.log("[drawings_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const drawings = await Drawing.find()
      .sort({ createdAt: "desc" })

      

    return NextResponse.json(drawings, { status: 200 });
  } catch (err) {
    console.log("[drawings_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

