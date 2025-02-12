import React from 'react'
import { processes } from '@/lib/data'
import Card from './Card'   
function Process() {
  return (
    <div className="flex flex-col gap-4">
        <h6 className="text-4xl lg:text-5xl font-bold text-iconic titr text-center">مراحل کار</h6>
        {

        processes.map( (project, i) => {

          return <Card key={`p_${i}`} {...project} i={i}/>

        })

      }
    </div>
  )
}

export default Process