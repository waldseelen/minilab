import React from 'react';

interface InstructionCardProps {
    title: string;
    steps: string[];
    emoji?: string;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
    title,
    steps,
    emoji = '📖'
}) => {
    return (
        <div
            className="instruction-card"
            style={{
                background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                border: '3px solid #00bcd4',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0, 188, 212, 0.2)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }} aria-hidden="true">{emoji}</span>
                <h3 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#00838f'
                }}>
                    {title}
                </h3>
            </div>

            <ol style={{
                margin: 0,
                paddingLeft: '24px',
                listStyleType: 'none',
                counterReset: 'step-counter'
            }}>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: '12px',
                            position: 'relative',
                            paddingLeft: '40px',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#00695c',
                            counterIncrement: 'step-counter',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '2px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            {index + 1}
                        </div>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default InstructionCard;
