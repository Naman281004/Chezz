export default function Tile({number, image}) {
    if(number%2==0)
    {
        return (
            <div className="w-[80px] h-[80px] bg-[#739552] flex justify-center items-center">
                {image && (
                    <div 
                        className="w-[60px] h-[60px] bg-no-repeat bg-contain bg-center chess-piece" 
                        style={{ backgroundImage: `url(${image})` }}
                    />
                )}
            </div>
        );
    }
    else
    {
        return (
            <div className="w-[80px] h-[80px] bg-[#EBECD0] flex justify-center items-center">
                {image && (
                    <div 
                        className="w-[60px] h-[60px] bg-no-repeat bg-contain bg-center chess-piece" 
                        style={{ backgroundImage: `url(${image})` }}
                    />
                )}
            </div>
        );
    }
}



