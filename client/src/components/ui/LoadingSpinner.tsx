interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps): JSX.Element => {
  return (
    <div
      className={`animate-spin rounded-full border-cyan-400 border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
};

export default LoadingSpinner;
