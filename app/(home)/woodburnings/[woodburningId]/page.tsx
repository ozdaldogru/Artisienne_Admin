"use client"

import Loader from '@/components/custom ui/Loader'
import WoodBurningForm from '@/components/ArtGroups/woodburnings/WoodBurningForm'
import { useEffect, useState, use } from 'react';

const WoodBurningDetails = (props: { params: Promise<{ woodburningId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [WoodBurningDetails, setWoodBurningDetails] = useState<WoodBurningType | null>(null)

  const getWoodBurningDetails = async () => {
    try { 
      const res = await fetch(`/api/woodburnings/${params.woodburningId}`, {
        method: "GET"
      })
      const data = await res.json()
      setWoodBurningDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[woodburningId_GET]", err)
    }
  }

  useEffect(() => {
    getWoodBurningDetails()
  })

  return loading ? <Loader /> : (
    <WoodBurningForm initialData={WoodBurningDetails} />
  )
}

export default WoodBurningDetails