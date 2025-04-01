"use client"
import React from 'react'
import { processesFa, processesEn  } from '@/lib/data'
import Card from './Card'   
import useSubdomain from '@/hooks/useSubdomain';
function Process() {
  const { hasFaSubdomain } = useSubdomain();
  const processes = hasFaSubdomain ? processesFa : processesEn; 
  return (
    <div className="flex flex-col gap-4">
        <h6 className="text-4xl lg:text-5xl font-bold text-iconic titr text-center">{hasFaSubdomain ? "مراحل کار" : "Process"}</h6>
        {

        processes.map( (project, i) => {

          return <Card key={`p_${i}`} {...project} i={i}/>

        })

      }
    </div>
  )
}

export default Process