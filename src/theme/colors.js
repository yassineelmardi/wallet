export const Spacing = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 };
export const BorderRadius = { sm:8, md:12, lg:16, xl:24, xxl:32, full:999 };
export const FontSize = { xs:11, sm:13, md:15, lg:17, xl:20, xxl:24, xxxl:32 };
export const Shadow = {
  sm: { shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:6, elevation:3 },
  md: { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.18, shadowRadius:10, elevation:6 },
  lg: { shadowColor:'#4F7EFF', shadowOffset:{width:0,height:8}, shadowOpacity:0.28, shadowRadius:16, elevation:12 },
};

export const DarkTheme = {
  background:'#0A0E1A', surface:'#111827', card:'#1A2235', cardAlt:'#1F2B42', cardElevated:'#243050',
  primary:'#4F7EFF', primaryLight:'#7B9FFF', primaryDark:'#2D5BCC', primarySurface:'#1A2C5A',
  accent:'#00C896', accentSurface:'#00281E', accentWarn:'#FF6B6B', accentWarnSurface:'#2E0E0E',
  accentYellow:'#FFB740', accentYellowSurface:'#2E1E00',
  textPrimary:'#F0F4FF', textSecondary:'#8A9BB8', textMuted:'#4E5E7A', textInverse:'#0A0E1A',
  border:'#1F2D47', borderLight:'#162035',
  success:'#00C896', error:'#FF6B6B', warning:'#FFB740', info:'#4F7EFF',
  gradientPrimary:['#5B8CFF','#3060DD'], gradientSuccess:['#00C896','#00966E'],
  gradientWarn:['#FF6B6B','#CC3030'], gradientCard:['#1A2235','#111827'],
  gradientGold:['#FFB740','#E07800'], gradientDark:['#1A2235','#0A0E1A'],
  tabBar:'#111827', tabBarBorder:'#1F2D47', statusBar:'light',
};

export const LightTheme = {
  background:'#F2F5FC', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#EEF2FF', cardElevated:'#E8EEFF',
  primary:'#4166E8', primaryLight:'#6B8FF5', primaryDark:'#2849CC', primarySurface:'#EEF2FF',
  accent:'#00A87A', accentSurface:'#E0FBF4', accentWarn:'#E84040', accentWarnSurface:'#FFF0F0',
  accentYellow:'#E07800', accentYellowSurface:'#FFF4E0',
  textPrimary:'#0D1526', textSecondary:'#4E6082', textMuted:'#A0AEC0', textInverse:'#FFFFFF',
  border:'#DDE3F0', borderLight:'#EEF2FF',
  success:'#00A87A', error:'#E84040', warning:'#E07800', info:'#4166E8',
  gradientPrimary:['#4F7EFF','#2D5BCC'], gradientSuccess:['#00C896','#00966E'],
  gradientWarn:['#FF6B6B','#CC3030'], gradientCard:['#FFFFFF','#EEF2FF'],
  gradientGold:['#FFB740','#E07800'], gradientDark:['#4F7EFF','#2D5BCC'],
  tabBar:'#FFFFFF', tabBarBorder:'#DDE3F0', statusBar:'dark',
};

// Backward compat — screens that import Colors directly still work
export const Colors = DarkTheme;