export default function Tile({number, image}) {
    const bgColor = number % 2 === 0 ? "bg-[#739552]" : "bg-[#EBECD0]";
    
    return (
        <div className={`w-[80px] h-[80px] ${bgColor} flex justify-center items-center`}>
            {image && (
                <div 
                    className="w-[60px] h-[60px] bg-no-repeat bg-contain bg-center chess-piece relative" 
                    style={{ 
                        backgroundImage: `url(${image})`,
                        // No z-index here - we'll handle this when a piece is active
                    }}
                />
            )}
        </div>
    );
}



