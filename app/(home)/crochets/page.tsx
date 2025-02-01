"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/ArtGroups/crochets/CrochetColumns";

const Crochets = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [crochets, setCrochets] = useState<CrochetType[]>([]);

  const getCrochets = async () => {
    try {
      const res = await fetch("/api/crochets", {
        method: "GET",
      });
      const data = await res.json();
      setCrochets(data);
      setLoading(false);
    } catch (err) {
      console.log("[crochets_GET]", err);
    }
  };

  useEffect(() => {
    getCrochets();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Crochets</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/crochets/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Crochet
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={crochets} searchKey="title" />
    </div>
  );
};

export default Crochets;
