"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import CrochetForm from '@/components/ArtGroups/crochets/CrochetForm'
import { useEffect, useState, use } from 'react';

const CrochetDetails = (props: { params: Promise<{ crochetId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true);
  const [crochetDetails, setCrochetDetails] = useState<CrochetType | null>(null);

  const getCrochetDetails = async () => {
    try { 
      const res = await fetch(`/api/crochets/${params.crochetId}`, {
        method: "GET"
      });
      if (!res.ok) {
        throw new Error('Failed to fetch crochet details');
      }
      const data = await res.json();
      setCrochetDetails(data);
    } catch (err) {
      console.log("[crochetId_GET]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCrochetDetails();
  }, );

  return loading ? <Loader /> : (
    <CrochetForm initialData={crochetDetails} />
  );
}

export default CrochetDetails;