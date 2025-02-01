"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import JewelryForm from '@/components/ArtGroups/jewelries/JewelryForm'
import { useEffect, useState, use } from 'react';

const JewelryDetails = (props: { params: Promise<{ jewelryId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [jewelryDetails, setJewelryDetails] = useState<JewelryType | null>(null)

  const getJewelryDetails = async () => {
    try { 
      const res = await fetch(`/api/jewelries/${params.jewelryId}`, {
        method: "GET"
      })
      const data = await res.json()
      setJewelryDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[jewelryId_GET]", err)
    }
  }

  useEffect(() => {
    getJewelryDetails()
  })

  return loading ? <Loader /> : (
    <JewelryForm initialData={jewelryDetails} />
  )
}

export default JewelryDetails