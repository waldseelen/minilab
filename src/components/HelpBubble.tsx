import React, { useState } from 'react';

interface HelpBubbleProps {
    message: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    icon?: string;
}

const HelpBubble: React.FC<HelpBubbleProps> = ({
    message,
    position = 'top',
    icon = '💡'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="help-bubble-trigger"
                aria-label={`Yardım: ${message}`}
                style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.9)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <span role="img" aria-hidden="true">{icon}</span>
            </button>

            {isVisible && (
                <div
                    className={`help-bubble-content ${positionClasses[position]}`}
                    role="tooltip"
                    style={{
                        position: 'absolute',
                        background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)',
                        border: '3px solid #FFD700',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        minWidth: '200px',
                        maxWidth: '280px',
                        whiteSpace: 'normal',
                        animation: 'bubblePop 0.3s ease-out',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }} aria-hidden="true">
                            {icon}
                        </span>
                        <p style={{ margin: 0, lineHeight: '1.5' }}>{message}</p>
                    </div>
                    {/* Arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            ...(position === 'top' && {
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '8px 8px 0 8px',
                                borderColor: '#FFD700 transparent transparent transparent',
                            }),
                            ...(position === 'bottom' && {
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '0 8px 8px 8px',
                                borderColor: 'transparent transparent #FFD700 transparent',
                            }),
                            ...(position === 'left' && {
                                left: '100%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderWidth: '8px 0 8px 8px',
                                borderColor: 'transparent transparent transparent #FFD700',
                            }),
                            ...(position === 'right' && {
                                right: '100%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderWidth: '8px 8px 8px 0',
                                borderColor: 'transparent #FFD700 transparent transparent',
                            }),
                        }}
                    />
                </div>
            )}

            <style>{`
        @keyframes bubblePop {
          0% {
            opacity: 0;
            transform: scale(0.8) translateX(-50%);
          }
          50% {
            transform: scale(1.05) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(-50%);
          }
        }

        .help-bubble-trigger:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.6);
        }
      `}</style>
        </div>
    );
};

export default HelpBubble;
