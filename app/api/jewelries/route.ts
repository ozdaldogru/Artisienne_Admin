import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Jewelry from "@/lib/models/Jewelery";


export const POST = async (req: NextRequest) => {
  try {
    const {userId}  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a jewelry", {
        status: 400,
      });
    }

    const newJewelry = await Jewelry.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newJewelry.save();

    return NextResponse.json(newJewelry, { status: 200 });
  } catch (err) {
    console.log("[jewelries_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const jewelries = await Jewelry.find()
      .sort({ createdAt: "desc" })

      

    return NextResponse.json(jewelries, { status: 200 });
  } catch (err) {
    console.log("[jewelries_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

