import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Painting from "@/lib/models/Painting";


export const POST = async (req: NextRequest) => {
  try {
    const {userId}  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a painting", {
        status: 400,
      });
    }

    const newPainting = await Painting.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newPainting.save();

    return NextResponse.json(newPainting, { status: 200 });
  } catch (err) {
    console.log("[paintings_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const paintings = await Painting.find()
      .sort({ createdAt: "desc" })

      

    return NextResponse.json(paintings, { status: 200 });
  } catch (err) {
    console.log("[paintings_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

