import { useState } from 'react';

interface HelpBubbleProps {
    message: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    icon?: string;
}

const HelpBubble = ({
    message,
    position = 'top' as const,
    icon = '💡'
}: HelpBubbleProps) => {
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
            >
                <span role="img" aria-hidden="true">{icon}</span>
            </button>

            {isVisible && (
                <div
                    className={`help-bubble-content ${positionClasses[position]}`}
                    role="tooltip"
                >
                    <div className="help-bubble-inner">
                        <span className="help-bubble-emoji" aria-hidden="true">{icon}</span>
                        <p className="help-bubble-text">{message}</p>
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
