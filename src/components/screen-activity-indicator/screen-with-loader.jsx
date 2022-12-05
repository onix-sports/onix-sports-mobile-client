import { ScreenActivityIndicator } from './screen-activity-indicator'

function ScreenWithLoader({ isLoading, children }) {
  if (isLoading) {
    return <ScreenActivityIndicator />
  }

  return (
    <>{children}</>
  );
}


export { ScreenWithLoader };
