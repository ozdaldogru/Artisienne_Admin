"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import TattooForm from '@/components/ArtGroups/tattoos/TattooForm'
import { useEffect, useState, use } from 'react';

const TattooDetails = (props: { params: Promise<{ tattooId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [tattooDetails, setTattooDetails] = useState<TattooType | null>(null)

  const getTattooDetails = async () => {
    try { 
      const res = await fetch(`/api/tattoos/${params.tattooId}`, {
        method: "GET"
      })
      const data = await res.json()
      setTattooDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[tattooId_GET]", err)
    }
  }

  useEffect(() => {
    getTattooDetails()
  })

  return loading ? <Loader /> : (
    <TattooForm initialData={tattooDetails} />
  )
}

export default TattooDetails