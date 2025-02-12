'use client'
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const Card = ({title, description, url, color, i}: {title: string, description: string, src: string, url: string, color: string, i: number}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path, rect');
      paths.forEach(path => {
        if (path instanceof SVGGeometryElement) {
          const length = path.getTotalLength();
          (path as SVGElement).style.setProperty('--path-length', length.toString());
        }
      });
    }
  }, [i]);

  const renderSVG = (index: number) => {
    switch(index) {
      case 0:
        return (
          <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#422800" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animate-svg"
          >
            <path d="M8 2v4" className="animate-path"/>
            <path d="M16 2v4" className="animate-path"/>
            <rect width="18" height="18" x="3" y="4" rx="2" className="animate-path"/>
            <path d="M3 10h18" className="animate-path"/>
            <path d="M8 14h.01" className="animate-path"/>
            <path d="M12 14h.01" className="animate-path"/>
            <path d="M16 14h.01" className="animate-path"/>
            <path d="M8 18h.01" className="animate-path"/>
            <path d="M12 18h.01" className="animate-path"/>
            <path d="M16 18h.01" className="animate-path"/>
          </svg>
        );
      case 1:
        return (
          <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#422800" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animate-svg"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" className="animate-path"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4" className="animate-path"/>
            <path d="m8 16 2-2-2-2" className="animate-path"/>
            <path d="M12 18h4" className="animate-path"/>
          </svg>
        );
      case 2:
        return (
          <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#422800" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animate-svg"
          >
            <path d="M12 21V7" className="animate-path"/>
            <path d="m16 12 2 2 4-4" className="animate-path"/>
            <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" className="animate-path"/>
          </svg>
        );
      case 3:
        return (
          <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#422800" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animate-svg"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" className="animate-path"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" className="animate-path"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" className="animate-path"/>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" className="animate-path"/>
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className="h-screen flex items-center justify-center sticky top-0">
      <div 
        className="flex flex-col relative h-[500px] w-[1000px] rounded-[25px] p-6 sm:p-12 origin-top backdrop-blur-md grainy"
        style={{backgroundColor: color, top:`calc(-5vh + ${i * 25}px)`}}
      >
            <span className='text-5xl titr text-iconic2'>0{i+1}</span>
        <h6 className='text-2xl font-bold titr text-iconic2'>
            {title}</h6>
        <div className="flex justify-center items-center sm:items-start flex-col sm:flex-row h-full mt-6 gap-5">
          <div className="relative sm:w-[40%]">
            <p className="text-base">{description}</p>
          </div>

          <div className="relative w-[60%] h-full rounded-[25px] overflow-hidden flex items-center justify-center bg-white/10">
            {renderSVG(i)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card