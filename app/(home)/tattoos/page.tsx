"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/ArtGroups/tattoos/TattooColumns";

const Tattoos = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tattoos, setTattoos] = useState<TattooType[]>([]);

  const getTattoos = async () => {
    try {
      const res = await fetch("/api/tattoos", {
        method: "GET",
      });
      const data = await res.json();
      setTattoos(data);
      setLoading(false);
    } catch (err) {
      console.log("[tattoos_GET]", err);
    }
  };

  useEffect(() => {
    getTattoos();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Tattoos</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/tattoos/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Tattoo
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={tattoos} searchKey="title" />
    </div>
  );
};

export default Tattoos;
