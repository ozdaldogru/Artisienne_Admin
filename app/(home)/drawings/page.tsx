"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/ArtGroups/drawings/DrawingColumns";

const Drawings = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [drawings, setDrawings] = useState<DrawingType[]>([]);

  const getDrawings = async () => {
    try {
      const res = await fetch("/api/drawings", {
        method: "GET",
      });
      const data = await res.json();
      setDrawings(data);
      setLoading(false);
    } catch (err) {
      console.log("[drawings_GET]", err);
    }
  };

  useEffect(() => {
    getDrawings();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Drawings</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/drawings/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Drawing
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={drawings} searchKey="title" />
    </div>
  );
};

export default Drawings;
