import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Crochet from "@/lib/models/Crochet";

export const POST = async (req: NextRequest) => {
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a crochet", {
        status: 400,
      });
    }

    const newCrochet = new Crochet({
      title,
      status,
      price,
      description,
      media,
    });

    await newCrochet.save();

    return NextResponse.json(newCrochet, { status: 200 });
  } catch (err) {
    console.log("[crochets_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const crochets = await Crochet.find().sort({ createdAt: "desc" });

    return NextResponse.json(crochets, { status: 200 });
  } catch (err) {
    console.log("[crochets_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
