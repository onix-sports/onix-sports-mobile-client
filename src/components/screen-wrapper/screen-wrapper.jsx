import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ScreenWrapper({
  children,
  withScrollView = true,
  style = null,
  contentContainerStyle,
  isRefreshing,
  onRefresh,
  ...props
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.background,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.left,
    },
  ];

  if (withScrollView) {
    return (
      <ScrollView
        {...props}
        contentContainerStyle={contentContainerStyle}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={[containerStyle, style]}
        refreshControl={onRefresh 
          ? <RefreshControl
              refreshing={isRefreshing}
              colors={colors.indicators}
              onRefresh={onRefresh}
              tintColor={colors.indicators}
            /> 
          : null}
      >
        {children}
      </ScrollView>
    );
  }

  if (onRefresh) {
    return (
      <ScrollView
        {...props}
        contentContainerStyle={contentContainerStyle}
        style={[containerStyle, style]}
        refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
        }
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { ScreenWrapper };
