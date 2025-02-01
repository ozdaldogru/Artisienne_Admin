"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../../ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Delete from "@/components/custom ui/Delete";
import Loader from "@/components/custom ui/Loader";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const formSchema = z.object({
  title: z.string().min(1),
  status: z.string(),
  price: z.coerce.number(),
  description: z.string().min(10).trim(),
  media: z.array(z.string()),
});

interface TattooFormProps {
  initialData?: TattooType | null; // Must have "?" to make it optional
}

const TattooForm: React.FC<TattooFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          title: "",
          status:"",
          price: 100,
          description: "",
          media: [],
        },
  });

  useEffect(() => {
    setLoading(false);
  }, [initialData]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData ? `/api/tattoos/${initialData._id}` : "/api/tattoos";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast.success(`Tattoo ${initialData ? "updated" : "created"}`);
        router.push("/tattoos");
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      console.log("[tattoos_POST]", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Tattoo</p>
          <Delete id={initialData._id} item="tattoo" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Tattoo</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            aria-label="Enter Title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Model" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

        <FormField
              control={form.control}
              name="status"
              aria-label="Select A Status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statuses</FormLabel>
                  <FormControl>
                  <select  
                  className=" border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                       {...field}>
                          <option className="overflow-visible bg-white">Select A Status </option>
                          <option className="overflow-visible bg-white">Archived </option>
                          <option className="overflow-visible bg-white">Pending </option>
                          <option className="overflow-visible bg-white">On Sale </option>
                          <option className="overflow-visible bg-white">Sold Out</option>

                      </select>  
       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />  

          <FormField
            control={form.control}
            name="price"
            aria-label="Enter Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            aria-label="enter detailed description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <JoditEditor {...field} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            aria-label="select images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" aria-label="click submit button">
              Submit
            </Button>
            <Button
              aria-label="click discard button"
              type="button"
              onClick={() => router.push("/tattoos")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TattooForm;