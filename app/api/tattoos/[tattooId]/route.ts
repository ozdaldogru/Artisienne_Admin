import Tattoo from "@/lib/models/Tattoo";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ tattooId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const tattoo = await Tattoo.findById(params.tattooId);

    if (!tattoo) {
      return new NextResponse(
        JSON.stringify({ message: "Tattoo not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(tattoo, { status: 200 });
  } catch (err) {
    console.log("[tattooId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ tattooId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let tattoo = await Tattoo.findById(params.tattooId);

    if (!tattoo) {
      return new NextResponse("Tattoo not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    tattoo = await Tattoo.findByIdAndUpdate(
      params.tattooId,
      { title },
      { new: true }
    );

    await tattoo.save();

    return NextResponse.json(tattoo, { status: 200 });
  } catch (err) {
    console.log("[tattooId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ tattooId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Tattoo.findByIdAndDelete(params.tattooId);
   
    return new NextResponse("Tattoo is deleted", { status: 200 });
  } catch (err) {
    console.log("[tattooId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

