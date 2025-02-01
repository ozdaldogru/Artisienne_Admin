import Painting from "@/lib/models/Painting";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ paintingId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const painting = await Painting.findById(params.paintingId);

    if (!painting) {
      return new NextResponse(
        JSON.stringify({ message: "Painting not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(painting), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[paintingId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ paintingId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const painting = await Painting.findById(params.paintingId);

    if (!painting) {
      return new NextResponse(
        JSON.stringify({ message: "Painting not found" }),
        { status: 404 }
      );
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new painting", {
        status: 400,
      });
    }

    // Update Painting
    const updatedPainting = await Painting.findByIdAndUpdate(
      painting._id,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await updatedPainting.save();

    return NextResponse.json(updatedPainting, { status: 200 });
  } catch (err) {
    console.log("[paintingId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ paintingId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const painting = await Painting.findById(params.paintingId);

    if (!painting) {
      return new NextResponse(
        JSON.stringify({ message: "Painting not found" }),
        { status: 404 }
      );
    }

    await Painting.findByIdAndDelete(painting._id);

    return new NextResponse(JSON.stringify({ message: "Painting deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[paintingId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

