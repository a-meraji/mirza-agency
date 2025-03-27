"use client"
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import React, { useRef } from 'react';
import styles from './style.module.css';

export default function Paragraph({paragraph}: {paragraph: string}) {

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"]
  })

  // Split by both \n and literal newlines
  const lines = paragraph.split(/\\n|\n/)
  let wordIndex = 0;
  const totalWords = paragraph.replace(/\\n|\n/g, ' ').replace(/\s+/g, ' ').split(' ').length;

  return (
    <p 
      ref={container}         
      className={styles.paragraph}
    >
      {lines.map((line, lineIndex) => {
        const words = line.trim().split(" ").filter(word => word.length > 0);
        
        return (
          <div key={lineIndex} className={styles.line}>
            {words.map((word) => {
              const start = wordIndex / totalWords;
              const end = start + (1 / totalWords);
              wordIndex++;
              return <Word 
                key={`${lineIndex}-${wordIndex}`} 
                progress={scrollYProgress} 
                range={[start, end]}
              >
                {word}
              </Word>
            })}
          </div>
        );
      })}
    </p>
  )
}

const Word = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0, 1])
  return <span className={styles.word}>
    <span className={styles.shadow}>{children}</span>
    <motion.span style={{opacity: opacity}}>{children}</motion.span>
  </span>
}