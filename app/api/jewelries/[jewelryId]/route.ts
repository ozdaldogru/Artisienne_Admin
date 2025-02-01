import Jewelry from "@/lib/models/Jewelery";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ jewelryId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const jewelry = await Jewelry.findById(params.jewelryId);

    if (!jewelry) {
      return new NextResponse(
        JSON.stringify({ message: "Jewelry not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(jewelry), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[jewelryId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ jewelryId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const jewelry = await Jewelry.findById(params.jewelryId);

    if (!jewelry) {
      return new NextResponse(
        JSON.stringify({ message: "Jewelry not found" }),
        { status: 404 }
      );
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new jewelry", {
        status: 400,
      });
    }

    // Update jewelry
    const updatedJewelry = await Jewelry.findByIdAndUpdate(
      jewelry._id,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await updatedJewelry.save();

    return NextResponse.json(updatedJewelry, { status: 200 });
  } catch (err) {
    console.log("[jewelryId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ jewelryId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const jewelry = await Jewelry.findById(params.jewelryId);

    if (!jewelry) {
      return new NextResponse(
        JSON.stringify({ message: "jewelry not found" }),
        { status: 404 }
      );
    }

    await Jewelry.findByIdAndDelete(jewelry._id);

    return new NextResponse(JSON.stringify({ message: "Jewelry deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[jewelryId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

