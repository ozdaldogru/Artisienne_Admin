"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import WearableForm from '@/components/ArtGroups/wearables/WearableForm'
import { useEffect, useState, use } from 'react';

const WearableDetails = (props: { params: Promise<{ wearableId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [wearableDetails, setWearableDetails] = useState<WearableType | null>(null)

  const getWearableDetails = async () => {
    try { 
      const res = await fetch(`/api/wearables/${params.wearableId}`, {
        method: "GET"
      })
      const data = await res.json()
      setWearableDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[wearableId_GET]", err)
    }
  }

  useEffect(() => {
    getWearableDetails()
  })

  return loading ? <Loader /> : (
    <WearableForm initialData={wearableDetails} />
  )
}

export default WearableDetails