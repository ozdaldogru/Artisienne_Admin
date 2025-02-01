"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import PaintingForm from '@/components/ArtGroups/paintings/PaintingForm'
import { useEffect, useState, use } from 'react';

const PaintingDetails = (props: { params: Promise<{ paintingId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [paintingDetails, setPaintingDetails] = useState<PaintingType | null>(null)

  const getPaintingDetails = async () => {
    try { 
      const res = await fetch(`/api/paintings/${params.paintingId}`, {
        method: "GET"
      })
      const data = await res.json()
      setPaintingDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[paintingId_GET]", err)
    }
  }

  useEffect(() => {
    getPaintingDetails()
  })

  return loading ? <Loader /> : (
    <PaintingForm initialData={paintingDetails} />
  )
}

export default PaintingDetails