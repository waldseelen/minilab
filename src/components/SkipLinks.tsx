import { useI18n } from '../i18n';

const SkipLinks = () => {
    const { t } = useI18n();

    return (
        <nav className="skip-links" aria-label="Skip navigation">
            <a href="#main-content" className="skip-link">
                {t('skip.main') || 'Ana içeriğe geç'}
            </a>
            <a href="#navigation" className="skip-link">
                {t('skip.nav') || 'Navigasyona geç'}
            </a>
        </nav>
    );
};

export default SkipLinks;
