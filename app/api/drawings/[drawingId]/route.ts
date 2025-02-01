import Drawing from "@/lib/models/Drawing";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ drawingId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const drawing = await Drawing.findById(params.drawingId);

    if (!drawing) {
      return new NextResponse(
        JSON.stringify({ message: "Drawing not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(drawing), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[drawingId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ drawingId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const drawing = await Drawing.findById(params.drawingId);

    if (!drawing) {
      return new NextResponse(
        JSON.stringify({ message: "Drawing not found" }),
        { status: 404 }
      );
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new drawing", {
        status: 400,
      });
    }

    // Update Drawing
    const updatedDrawing = await Drawing.findByIdAndUpdate(
      drawing._id,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await updatedDrawing.save();

    return NextResponse.json(updatedDrawing, { status: 200 });
  } catch (err) {
    console.log("[drawingId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ drawingId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const drawing = await Drawing.findById(params.drawingId);

    if (!drawing) {
      return new NextResponse(
        JSON.stringify({ message: "Drawing not found" }),
        { status: 404 }
      );
    }

    await Drawing.findByIdAndDelete(drawing._id);

    return new NextResponse(JSON.stringify({ message: "Drawing deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[drawingId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

