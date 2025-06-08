import { Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { styled } from '@mui/system';

interface ContinueButtonProps {
  onClick: () => void;
  buttonLoading: boolean;
  isCheckup?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  widthOverride?: string;
}

const StyledButton = styled(Button)(({ widthOverride }: { widthOverride?: string }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: '0.75rem var(--Spacing-0, 0rem)',
    gap: 'var(--Spacing-0, 0rem)',
    borderRadius: 'var(--Corner-radius-M, 0.75rem)',
    background: 'var(--Fill-Strong, rgba(0, 0, 0, 0.90))',
    color: 'var(--primary-contrast, #FFF)',
    textAlign: 'center',
    fontFeatureSettings: "'liga' off, 'clig' off",
    textTransform: 'none',
    width: widthOverride || '100%',
    maxWidth: '100%',
    height: '3rem',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.66)',
    },
  }));

export default function ContinueButtonV3({
  buttonLoading,
  onClick,
  disabled = false,
  fullWidth = true,
  widthOverride,
}: ContinueButtonProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldReappear, setShouldReappear] = useState(false);

  useEffect(() => {
    if (isExiting) {
      const hideTimeout = setTimeout(() => setIsVisible(false), 300);
      const reappearTimeout = setTimeout(() => {
        setShouldReappear(true);
        setIsExiting(false);
        setIsVisible(true);
      }, 3300);
      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(reappearTimeout);
      };
    }
  }, [isExiting]);

  useEffect(() => {
    if (shouldReappear) setShouldReappear(false);
  }, [shouldReappear]);

  if (!isVisible) return null;

  const onButtonPress = () => {
    setIsExiting(true);
    onClick();
  };

  return (
    <div
      className={`fixed bottom-6 md:static z-30 w-full ${
        isExiting ? 'animate-buttonExit' : 'animate-buttonEnter'
      }`}
      style={{
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
        transform: isExiting ? 'translateY(50%)' : 'translateY(0)',
        left: 0,
      }}
    >
      {/* Inner container: matches main layout */}
      <div
        style={{
            maxWidth: 'rem',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <StyledButton onClick={onButtonPress} disabled={disabled} widthOverride={widthOverride}>
          {buttonLoading ? (
            <CircularProgress sx={{ color: 'white' }} size={22} />
          ) : (
            <span
              className="inter_body_medium_bold text-white"
              style={{
                fontSize: 'clamp(1rem, 1.2vw + 0.5rem, 1.25rem)',
                lineHeight: 'var(--Line-Height-Body-Medium, 1.5rem)',
              }}
            >
              Continue
            </span>
          )}
        </StyledButton>
      </div>
    </div>
  );
};  

