import WoodBurning from "@/lib/models/WoodBurning";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ woodburningId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const woodburning = await WoodBurning.findById(params.woodburningId);

    if (!woodburning) {
      return new NextResponse(
        JSON.stringify({ message: "WoodBurning not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(woodburning, { status: 200 });
  } catch (err) {
    console.log("[woodburningId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ woodburningId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let woodburning = await WoodBurning.findById(params.woodburningId);

    if (!woodburning) {
      return new NextResponse(
        JSON.stringify({ message: "WoodBurning not found" }), { status: 404 });
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new woodburning", {status: 400,});
    }

    // Update WoodBurning
    woodburning = await WoodBurning.findByIdAndUpdate(
      params.woodburningId,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await woodburning.save();

    return NextResponse.json(woodburning, { status: 200 });
  } catch (err) {
    console.log("[woodburningId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ woodburningId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await WoodBurning.findByIdAndDelete(params.woodburningId);
   
    return new NextResponse("WoodBurning is deleted", { status: 200 });
  } catch (err) {
    console.log("[woodburningId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";