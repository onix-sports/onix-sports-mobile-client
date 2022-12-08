import { NavigationContext } from './navigation-context';

function NavigationProvider({ children, rootNav }) {
  return (
    <NavigationContext.Provider
      value={{
        rootNav,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
