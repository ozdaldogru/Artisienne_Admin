"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import {columns} from "@/components/ArtGroups/jewelries/JewelryColumns";

const Jewelries = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jewelries, setJewelries] = useState<JewelryType[]>([]);

  const getJewelries = async () => {
    try {
      const res = await fetch("/api/jewelries", {
        method: "GET",
      });
      const data = await res.json();
      setJewelries(data);
      setLoading(false);
    } catch (err) {
      console.log("[jewelries_GET]", err);
    }
  };

  useEffect(() => {
    getJewelries();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Jewelries</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/jewelries/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Jewelry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={jewelries} searchKey="title" />
    </div>
  );
};

export default Jewelries;
