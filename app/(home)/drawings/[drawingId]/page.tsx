"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import DrawingForm from '@/components/ArtGroups/drawings/DrawingForm'
import { useEffect, useState, use } from 'react';

const DrawingDetails = (props: { params: Promise<{ drawingId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [drawingDetails, setDrawingDetails] = useState<DrawingType | null>(null)

  const getDrawingDetails = async () => {
    try { 
      const res = await fetch(`/api/drawings/${params.drawingId}`, {
        method: "GET"
      })
      const data = await res.json()
      setDrawingDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[drawingId_GET]", err)
    }
  }

  useEffect(() => {
    getDrawingDetails()
  })

  return loading ? <Loader /> : (
    <DrawingForm initialData={drawingDetails} />
  )
}

export default DrawingDetails;