"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/ArtGroups/wearables/WearableColumns";

const Wearables = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [wearables, setWearables] = useState<WearableType[]>([]);

  const getWearables = async () => {
    try {
      const res = await fetch("/api/wearables", {
        method: "GET",
      });
      const data = await res.json();
      setWearables(data);
      setLoading(false);
    } catch (err) {
      console.log("[wearables_GET]", err);
    }
  };

  useEffect(() => {
    getWearables();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Wearables</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/wearables/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Wearable
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={wearables} searchKey="title" />
    </div>
  );
};

export default Wearables;
