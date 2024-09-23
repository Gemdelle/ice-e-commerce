import React from 'react';

interface SnowflakeProps {
    style: React.CSSProperties;
}

const Snowflake: React.FC<SnowflakeProps> = ({style}) => (
    <div style={style}/>
);

interface SnowAnimationProps {
    snowflakeCount?: number;
    imagePath?: string;
}

const Sparkles: React.FC<SnowAnimationProps> = ({
                                                    snowflakeCount = 100,
                                                    imagePath = '/assets/sparkle.png'
                                                }) => {
    const snowflakeStyle: React.CSSProperties = {
        position: 'fixed',
        width: '3vh',
        height: '3vh',
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        top: '-10vh'
    };

    const generateSnowflakes = () => {
        return Array.from({length: snowflakeCount}).map((_, index) => {
            const animationDuration = 30 + Math.random() * 20;
            const animationDelay = Math.random() * 10;
            const leftPosition = Math.random() * 100;

            const style: React.CSSProperties = {
                ...snowflakeStyle,
                left: `${leftPosition}%`,
                animation: `fall ${animationDuration}s linear ${animationDelay}s infinite, 
                    sparkle 3s ease-in-out infinite`,
            };

            return <Snowflake key={index} style={style}/>;
        });
    };

    return (
        <>
            <div style={{overflow: 'hidden', position: 'fixed', width: '100%', height: '100%', pointerEvents: 'none'}}>
                {generateSnowflakes()}
            </div>
            <style>{`
        @keyframes fall {
          0% {
            top: -20vh;
            transform: scale(1);
          }
          100% {
            transform: scale(1);
            top: 100vh
          }
        }
        @keyframes sparkle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
        </>
    );
};

export default Sparkles;