'use client'
import Image from 'next/image';

const Card = ({title, description, url, color, i}: {title: string, description: string, src: string, url: string, color: string, i: number}) => {
  const renderSVG = (index: number) => {
    switch(index) {
      case 0:
        return (
          <svg 
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
      default:
        return null;
    }
  }

  return (
    <div className="h-screen flex items-center justify-center sticky top-0">
      <div 
        className="flex flex-col relative h-[500px] w-[1000px] rounded-[25px] p-[50px] origin-top backdrop-blur-md grainy"
        style={{backgroundColor: color, top:`calc(-5vh + ${i * 25}px)`}}
      >
        <h6 className='text-2xl font-bold titr text-iconic2'>{title}</h6>
        <div className="flex flex-col sm:flex-row h-full mt-12 gap-5">
          <div className="relative sm:w-[40%]">
            <p className="text-base">{description}</p>
            <span className="flex items-center gap-[5px]">
              <a href={url} target="_blank" className="text-xs underline cursor-pointer">See more</a>
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="black"/>
              </svg>
            </span>
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