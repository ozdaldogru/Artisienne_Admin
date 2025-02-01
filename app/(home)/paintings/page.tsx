"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/ArtGroups/paintings/PaintingColumns";

const Paintings = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paintings, setPaintings] = useState<PaintingType[]>([]);

  const getPaintings = async () => {
    try {
      const res = await fetch("/api/paintings", {
        method: "GET",
      });
      const data = await res.json();
      setPaintings(data);
      setLoading(false);
    } catch (err) {
      console.log("[paintings_GET]", err);
    }
  };

  useEffect(() => {
    getPaintings();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Paintings</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/paintings/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Painting
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={paintings} searchKey="title" />
    </div>
  );
};

export default Paintings;
