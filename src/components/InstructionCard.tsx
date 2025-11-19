

interface InstructionCardProps {
    title: string;
    steps: string[];
    emoji?: string;
}

const InstructionCard = ({ title, steps, emoji = '📖' }: InstructionCardProps) => {
    return (
        <div className="instruction-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }} aria-hidden="true">{emoji}</span>
                <h3>{title}</h3>
            </div>
            <ol>
                {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default InstructionCard;
