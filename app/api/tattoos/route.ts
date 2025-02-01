import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Tattoo from "@/lib/models/Tattoo";


export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB();

    const {
      title,
      status,
      price,
      description,
      media,
      
    } = await req.json();

    const existingTattoo = await Tattoo.findOne({ title })

    if (existingTattoo) {
      return new NextResponse("Tattoo is already exists", { status: 400 })
    }

    if (!title ) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const newTattoo = await Tattoo.create({
      title,
      status,
      price,
      description,
      media,
    });

    await newTattoo.save()

    return NextResponse.json(newTattoo, { status: 200 })
  } catch (err) {
    console.log("[tattoos_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const tattoos = await Tattoo.find().sort({ createdAt: "desc" })

    return NextResponse.json(tattoos, { status: 200 })
  } catch (err) {
    console.log("[tattoos_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";


