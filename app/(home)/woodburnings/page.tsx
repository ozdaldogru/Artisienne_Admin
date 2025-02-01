"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/ArtGroups/woodburnings/WoodBurningColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const WoodBurnings = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setWoodBurnings] = useState([]);

  const getWoodBurnings = async () => {
    try {
      const res = await fetch("/api/woodburnings", {
        method: "GET",
      });
      const data = await res.json();
      setWoodBurnings(data);
      setLoading(false);
    } catch (err) {
      console.log("[woodburnings_GET]", err);
    }
  };

  useEffect(() => {
    getWoodBurnings();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">WoodBurnings</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/woodburnings/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A WoodBurning
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={categories} searchKey="title" />
    </div>
  );
};

export default WoodBurnings;
