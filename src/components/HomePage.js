import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export default function HomePage({user}){
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mounts
        setLoaded(true);
    }, []);

    return(
        <div className="home">
            <div className={`title-container ${loaded ? 'fade-in' : ''}`}>
                <div className="chess-icon king-icon"></div>
                <h1 className="main-title">CHEZZ</h1>
                <div className="chess-icon queen-icon"></div>
            </div>
            
            <div className={`tagline ${loaded ? 'slide-up' : ''}`}>
                <h2>Master the game. Make your move.</h2>
            </div>
            
            <div className={`home-options ${loaded ? 'fade-in-delayed' : ''}`}>
                <div className="option-card" onClick={() => navigate("/playvscomputer")}>
                    <div className="option-icon ai-icon"></div>
                    <h3>Play vs. AI</h3>
                    <p>Challenge our intelligent chess algorithm</p>
                </div>
                
                <div className="option-card" onClick={() => navigate("/randvsrand")}>
                    <div className="option-icon human-icon"></div>
                    <h3>Human vs. Human</h3>
                    <p>Play with a friend on the same device</p>
                </div>
                
                <div className="option-card" onClick={() => navigate("/visualize")}>
                    <div className="option-icon visualize-icon"></div>
                    <h3>Visualize AI</h3>
                    <p>See how the algorithm thinks</p>
                </div>
            </div>
        </div>
    )
}