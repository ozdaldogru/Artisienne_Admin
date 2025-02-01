import Crochet from "@/lib/models/Crochet";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET request handler
export const GET = async (req: NextRequest, props: { params: Promise<{ crochetId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const crochet = await Crochet.findById(params.crochetId);

    if (!crochet) {
      return new NextResponse(
        JSON.stringify({ message: "Crochet not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(crochet), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[crochetId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// POST request handler
export const POST = async (req: NextRequest, props: { params: Promise<{ crochetId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const crochet = await Crochet.findById(params.crochetId);

    if (!crochet) {
      return new NextResponse(
        JSON.stringify({ message: "Crochet not found" }),
        { status: 404 }
      );
    }

    const { title, status, price, description, media } = await req.json();

    if (!title || !status || !price || !description || !media) {
      return new NextResponse("Not enough data to create a new crochet", {
        status: 400,
      });
    }

    // Update Crochet
    const updatedCrochet = await Crochet.findByIdAndUpdate(
      crochet._id,
      {
        title,
        status,
        price,
        description,
        media,
      },
      { new: true }
    );

    await updatedCrochet.save();

    return NextResponse.json(updatedCrochet, { status: 200 });
  } catch (err) {
    console.log("[crochetId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// DELETE request handler
export const DELETE = async (req: NextRequest, props: { params: Promise<{ crochetId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const crochet = await Crochet.findById(params.crochetId);

    if (!crochet) {
      return new NextResponse(
        JSON.stringify({ message: "Crochet not found" }),
        { status: 404 }
      );
    }

    await Crochet.findByIdAndDelete(crochet._id);

    return new NextResponse(JSON.stringify({ message: "Crochet deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[crochetId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";