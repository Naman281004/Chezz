import React from "react";

export default function Tile({ number, image, highlight }) {
  const isEven = number % 2 === 0;
  const bgColor = isEven ? "bg-[#DEF4FC]" : "bg-[#8BADC2]";

  return (
    <div className={`relative flex items-center justify-center ${bgColor} w-[80px] h-[80px]`}>
      {/* Black circle with opacity 0.25 */}
      {highlight && (
        <div className="absolute inset-0 flex items-center justify-center">
            <div
            className="w-[20px] h-[20px] rounded-full"
            style={{
                backgroundColor: 'black',
                opacity: 0.25
            }}            
            />
        </div>
      )}
      
      {/* Chess piece */}
      {image && (
        <div
          className="chess-piece w-[60px] h-[60px] bg-no-repeat bg-contain bg-center cursor-grab active:cursor-grabbing z-20"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
    </div>
  );
}



