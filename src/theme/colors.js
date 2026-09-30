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

// ─── A. Dark Fintech Premium ────────────────────────────────────────────────

export const FintechDarkTheme = {
  background:'#0B1020', surface:'#131A2E', card:'#161E33', cardAlt:'#1C2540', cardElevated:'#222C4D',
  primary:'#4F7CFF', primaryLight:'#82A3FF', primaryDark:'#2E56D4', primarySurface:'#17264F',
  accent:'#00C48C', accentSurface:'#032A20', accentWarn:'#FF5B5B', accentWarnSurface:'#2E1010',
  accentYellow:'#FFB84D', accentYellowSurface:'#2E2006',
  textPrimary:'#EEF2FF', textSecondary:'#A7B8D6', textMuted:'#8496B8', textInverse:'#0B1020',
  border:'#212B47', borderLight:'#18203A',
  success:'#00C48C', error:'#FF5B5B', warning:'#FFB84D', info:'#4F7CFF',
  gradientPrimary:['#5B8CFF','#2E56D4'], gradientSuccess:['#00C48C','#00916A'],
  gradientWarn:['#FF5B5B','#C93030'], gradientCard:['#161E33','#131A2E'],
  gradientGold:['#FFB84D','#D98A12'], gradientDark:['#161E33','#0B1020'],
  tabBar:'#131A2E', tabBarBorder:'#212B47', statusBar:'light',
};

export const FintechLightTheme = {
  background:'#F4F7FE', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#EDF2FF', cardElevated:'#E4EBFF',
  primary:'#2F5BD4', primaryLight:'#6A8CF0', primaryDark:'#1F3E99', primarySurface:'#E8EEFF',
  accent:'#00785A', accentSurface:'#DFF7EF', accentWarn:'#C63535', accentWarnSurface:'#FDECEC',
  accentYellow:'#9A5A00', accentYellowSurface:'#FFF2DC',
  textPrimary:'#0B1020', textSecondary:'#44557A', textMuted:'#5E6E8F', textInverse:'#FFFFFF',
  border:'#DCE3F2', borderLight:'#EDF1FA',
  success:'#00785A', error:'#C63535', warning:'#9A5A00', info:'#2F5BD4',
  gradientPrimary:['#4F7CFF','#2E56D4'], gradientSuccess:['#00C48C','#00785A'],
  gradientWarn:['#FF5B5B','#C63535'], gradientCard:['#FFFFFF','#EDF2FF'],
  gradientGold:['#FFB84D','#9A5A00'], gradientDark:['#4F7CFF','#1F3E99'],
  tabBar:'#FFFFFF', tabBarBorder:'#DCE3F2', statusBar:'dark',
};

// ─── B. Apple Minimal ───────────────────────────────────────────────────────

export const AppleDarkTheme = {
  background:'#000000', surface:'#1C1C1E', card:'#1C1C1E', cardAlt:'#2C2C2E', cardElevated:'#3A3A3C',
  primary:'#0A84FF', primaryLight:'#64B5FF', primaryDark:'#0060DF', primarySurface:'#0A2540',
  accent:'#30D158', accentSurface:'#0B2E16', accentWarn:'#FF453A', accentWarnSurface:'#3A1210',
  accentYellow:'#FF9F0A', accentYellowSurface:'#3A2606',
  textPrimary:'#FFFFFF', textSecondary:'#AEAEB2', textMuted:'#98989D', textInverse:'#000000',
  border:'#38383A', borderLight:'#2C2C2E',
  success:'#30D158', error:'#FF453A', warning:'#FF9F0A', info:'#0A84FF',
  gradientPrimary:['#0A84FF','#0060DF'], gradientSuccess:['#30D158','#248A3D'],
  gradientWarn:['#FF453A','#C9302C'], gradientCard:['#1C1C1E','#000000'],
  gradientGold:['#FF9F0A','#C77700'], gradientDark:['#1C1C1E','#000000'],
  tabBar:'#1C1C1E', tabBarBorder:'#38383A', statusBar:'light',
};

export const AppleLightTheme = {
  background:'#F2F2F7', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#F2F2F7', cardElevated:'#E5E5EA',
  primary:'#0062CC', primaryLight:'#007AFF', primaryDark:'#004999', primarySurface:'#E5F0FF',
  accent:'#1E7B34', accentSurface:'#E3F7E8', accentWarn:'#C9302C', accentWarnSurface:'#FDECEB',
  accentYellow:'#8A5A00', accentYellowSurface:'#FFF3DE',
  textPrimary:'#1C1C1E', textSecondary:'#48484A', textMuted:'#636366', textInverse:'#FFFFFF',
  border:'#D1D1D6', borderLight:'#E5E5EA',
  success:'#1E7B34', error:'#C9302C', warning:'#8A5A00', info:'#0062CC',
  gradientPrimary:['#007AFF','#0062CC'], gradientSuccess:['#34C759','#1E7B34'],
  gradientWarn:['#FF3B30','#C9302C'], gradientCard:['#FFFFFF','#F2F2F7'],
  gradientGold:['#FF9500','#8A5A00'], gradientDark:['#007AFF','#004999'],
  tabBar:'#FFFFFF', tabBarBorder:'#D1D1D6', statusBar:'dark',
};

// ─── C. Neo Banking Luxury ──────────────────────────────────────────────────

export const LuxuryDarkTheme = {
  background:'#0A0A0B', surface:'#141416', card:'#1A1A1D', cardAlt:'#222226', cardElevated:'#2A2A30',
  primary:'#D4AF37', primaryLight:'#E8CC6A', primaryDark:'#A8862A', primarySurface:'#2A2413',
  accent:'#4CAF7D', accentSurface:'#0F2A1E', accentWarn:'#E05B5B', accentWarnSurface:'#2E1212',
  accentYellow:'#D4AF37', accentYellowSurface:'#2A2413',
  textPrimary:'#F5F1E8', textSecondary:'#BDB3A1', textMuted:'#9A9081', textInverse:'#0A0A0B',
  border:'#2A2A2E', borderLight:'#1F1F23',
  success:'#4CAF7D', error:'#E05B5B', warning:'#D4AF37', info:'#C7A233',
  gradientPrimary:['#E8CC6A','#A8862A'], gradientSuccess:['#4CAF7D','#2F7F57'],
  gradientWarn:['#E05B5B','#A93636'], gradientCard:['#1A1A1D','#141416'],
  gradientGold:['#E8CC6A','#A8862A'], gradientDark:['#1A1A1D','#0A0A0B'],
  tabBar:'#141416', tabBarBorder:'#2A2A2E', statusBar:'light',
};

export const LuxuryLightTheme = {
  background:'#FAF8F3', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#F3EFE4', cardElevated:'#EBE5D6',
  primary:'#8A6D1F', primaryLight:'#B08F2E', primaryDark:'#634E14', primarySurface:'#F7F0DC',
  accent:'#2F7F57', accentSurface:'#E4F3EA', accentWarn:'#B33A3A', accentWarnSurface:'#FBEBEB',
  accentYellow:'#8A6D1F', accentYellowSurface:'#F7F0DC',
  textPrimary:'#16150F', textSecondary:'#4A463A', textMuted:'#63604F', textInverse:'#FFFFFF',
  border:'#E0D9C8', borderLight:'#F0EBDF',
  success:'#2F7F57', error:'#B33A3A', warning:'#8A6D1F', info:'#8A6D1F',
  gradientPrimary:['#B08F2E','#8A6D1F'], gradientSuccess:['#4CAF7D','#2F7F57'],
  gradientWarn:['#E05B5B','#B33A3A'], gradientCard:['#FFFFFF','#F3EFE4'],
  gradientGold:['#D4AF37','#8A6D1F'], gradientDark:['#8A6D1F','#634E14'],
  tabBar:'#FFFFFF', tabBarBorder:'#E0D9C8', statusBar:'dark',
};

// ─── D. Cyber Wallet ────────────────────────────────────────────────────────

export const CyberDarkTheme = {
  background:'#05060A', surface:'#0C0E16', card:'#11131F', cardAlt:'#171A2B', cardElevated:'#1E2238',
  primary:'#00E5FF', primaryLight:'#6AF3FF', primaryDark:'#00A9BF', primarySurface:'#062B33',
  accent:'#A855F7', accentSurface:'#24103A', accentWarn:'#FF4D6D', accentWarnSurface:'#2E0F17',
  accentYellow:'#FFC857', accentYellowSurface:'#2E2206',
  textPrimary:'#E8F6FF', textSecondary:'#A8BED2', textMuted:'#8BA3BA', textInverse:'#05060A',
  border:'#1E2238', borderLight:'#151828',
  success:'#00E5A0', error:'#FF4D6D', warning:'#FFC857', info:'#00E5FF',
  gradientPrimary:['#00E5FF','#A855F7'], gradientSuccess:['#00E5A0','#00A175'],
  gradientWarn:['#FF4D6D','#C22947'], gradientCard:['#11131F','#0C0E16'],
  gradientGold:['#FFC857','#D19400'], gradientDark:['#11131F','#05060A'],
  tabBar:'#0C0E16', tabBarBorder:'#1E2238', statusBar:'light',
};

export const CyberLightTheme = {
  background:'#F4F8FC', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#E8F4F8', cardElevated:'#DCEEF5',
  primary:'#00707F', primaryLight:'#00A9BF', primaryDark:'#005260', primarySurface:'#DFF4F8',
  accent:'#7C3AED', accentSurface:'#F0E7FE', accentWarn:'#C81E45', accentWarnSurface:'#FDE9EE',
  accentYellow:'#8A6100', accentYellowSurface:'#FFF4DA',
  textPrimary:'#0A0F1C', textSecondary:'#3E5064', textMuted:'#5A6C80', textInverse:'#FFFFFF',
  border:'#D5E2EC', borderLight:'#E9F1F6',
  success:'#00795C', error:'#C81E45', warning:'#8A6100', info:'#00707F',
  gradientPrimary:['#00A9BF','#7C3AED'], gradientSuccess:['#00C48C','#00795C'],
  gradientWarn:['#FF4D6D','#C81E45'], gradientCard:['#FFFFFF','#E8F4F8'],
  gradientGold:['#FFC857','#8A6100'], gradientDark:['#00707F','#005260'],
  tabBar:'#FFFFFF', tabBarBorder:'#D5E2EC', statusBar:'dark',
};

// ─── E. Midnight Blue ───────────────────────────────────────────────────────

export const MidnightDarkTheme = {
  background:'#0A1428', surface:'#101E38', card:'#152442', cardAlt:'#1C2E52', cardElevated:'#243A63',
  primary:'#6E9BF2', primaryLight:'#9CBCF7', primaryDark:'#3A66BF', primarySurface:'#16294D',
  accent:'#45C9A0', accentSurface:'#0A2E25', accentWarn:'#EE7189', accentWarnSurface:'#331419',
  accentYellow:'#E6B25C', accentYellowSurface:'#33260E',
  textPrimary:'#EAF0FA', textSecondary:'#AFC0D8', textMuted:'#92A6C2', textInverse:'#0A1428',
  border:'#213456', borderLight:'#182742',
  success:'#45C9A0', error:'#EE7189', warning:'#E6B25C', info:'#6E9BF2',
  gradientPrimary:['#6E9BF2','#3A66BF'], gradientSuccess:['#45C9A0','#26906F'],
  gradientWarn:['#EE7189','#B8455C'], gradientCard:['#152442','#101E38'],
  gradientGold:['#E6B25C','#B07C22'], gradientDark:['#152442','#0A1428'],
  tabBar:'#101E38', tabBarBorder:'#213456', statusBar:'light',
};

export const MidnightLightTheme = {
  background:'#F1F4FA', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#E9EFF8', cardElevated:'#DFE8F4',
  primary:'#2C5290', primaryLight:'#5980C4', primaryDark:'#1D3A6B', primarySurface:'#E6EDF8',
  accent:'#1F7A5E', accentSurface:'#E0F2EC', accentWarn:'#B8455C', accentWarnSurface:'#FAEAEE',
  accentYellow:'#87611A', accentYellowSurface:'#FBF1DD',
  textPrimary:'#0A1428', textSecondary:'#3E5170', textMuted:'#5B6E8C', textInverse:'#FFFFFF',
  border:'#D7E0EE', borderLight:'#E9EFF8',
  success:'#1F7A5E', error:'#B8455C', warning:'#87611A', info:'#2C5290',
  gradientPrimary:['#5980C4','#2C5290'], gradientSuccess:['#45C9A0','#1F7A5E'],
  gradientWarn:['#EE7189','#B8455C'], gradientCard:['#FFFFFF','#E9EFF8'],
  gradientGold:['#E6B25C','#87611A'], gradientDark:['#2C5290','#152442'],
  tabBar:'#FFFFFF', tabBarBorder:'#D7E0EE', statusBar:'dark',
};

// ─── F. Emerald Finance ─────────────────────────────────────────────────────

export const EmeraldDarkTheme = {
  background:'#04150F', surface:'#0A2018', card:'#0E2A20', cardAlt:'#14372A', cardElevated:'#1B4535',
  primary:'#34D399', primaryLight:'#6EE7B7', primaryDark:'#0F9F72', primarySurface:'#0B3327',
  accent:'#34D399', accentSurface:'#0B3327', accentWarn:'#F08A7A', accentWarnSurface:'#3A1712',
  accentYellow:'#E3B341', accentYellowSurface:'#33280B',
  textPrimary:'#E8F7F0', textSecondary:'#A6CBBA', textMuted:'#8BB3A1', textInverse:'#04150F',
  border:'#1B4030', borderLight:'#123023',
  success:'#34D399', error:'#F08A7A', warning:'#E3B341', info:'#34D399',
  gradientPrimary:['#34D399','#0F9F72'], gradientSuccess:['#6EE7B7','#0F9F72'],
  gradientWarn:['#F08A7A','#B8503F'], gradientCard:['#0E2A20','#0A2018'],
  gradientGold:['#E3B341','#A87F17'], gradientDark:['#0E2A20','#04150F'],
  tabBar:'#0A2018', tabBarBorder:'#1B4030', statusBar:'light',
};

export const EmeraldLightTheme = {
  background:'#F3FAF6', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#E7F5EE', cardElevated:'#DAEFE4',
  primary:'#047857', primaryLight:'#10B981', primaryDark:'#065F46', primarySurface:'#DCF5EA',
  accent:'#047857', accentSurface:'#DCF5EA', accentWarn:'#B03A2B', accentWarnSurface:'#FBEAE7',
  accentYellow:'#8A6209', accentYellowSurface:'#FBF2DC',
  textPrimary:'#06251A', textSecondary:'#3A5B4E', textMuted:'#54776A', textInverse:'#FFFFFF',
  border:'#D4E8DD', borderLight:'#E7F5EE',
  success:'#047857', error:'#B03A2B', warning:'#8A6209', info:'#047857',
  gradientPrimary:['#10B981','#047857'], gradientSuccess:['#34D399','#047857'],
  gradientWarn:['#F08A7A','#B03A2B'], gradientCard:['#FFFFFF','#E7F5EE'],
  gradientGold:['#E3B341','#8A6209'], gradientDark:['#047857','#065F46'],
  tabBar:'#FFFFFF', tabBarBorder:'#D4E8DD', statusBar:'dark',
};

// ─── G. Sunset Gradient ─────────────────────────────────────────────────────

export const SunsetDarkTheme = {
  background:'#160E1F', surface:'#1F142B', card:'#261935', cardAlt:'#312043', cardElevated:'#3C2852',
  primary:'#FF8A4C', primaryLight:'#FFB08A', primaryDark:'#D45E27', primarySurface:'#3A2118',
  accent:'#C084FC', accentSurface:'#2B1A40', accentWarn:'#FF6B8A', accentWarnSurface:'#3A1420',
  accentYellow:'#FFC46B', accentYellowSurface:'#3A2A10',
  textPrimary:'#FCEFFF', textSecondary:'#CBB2DC', textMuted:'#B096C4', textInverse:'#160E1F',
  border:'#3A2850', borderLight:'#2A1C3B',
  success:'#4ADE80', error:'#FF6B8A', warning:'#FFC46B', info:'#C084FC',
  gradientPrimary:['#FF8A4C','#A855F7'], gradientSuccess:['#4ADE80','#1F9D55'],
  gradientWarn:['#FF6B8A','#C43C5C'], gradientCard:['#261935','#1F142B'],
  gradientGold:['#FFC46B','#D48A1F'], gradientDark:['#261935','#160E1F'],
  tabBar:'#1F142B', tabBarBorder:'#3A2850', statusBar:'light',
};

export const SunsetLightTheme = {
  background:'#FFF7F3', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#FDEDE4', cardElevated:'#FAE2D5',
  primary:'#C2410C', primaryLight:'#F97316', primaryDark:'#9A3412', primarySurface:'#FEEBE0',
  accent:'#7E22CE', accentSurface:'#F3E8FF', accentWarn:'#BE123C', accentWarnSurface:'#FFE4E9',
  accentYellow:'#92620A', accentYellowSurface:'#FDF3DC',
  textPrimary:'#1F1226', textSecondary:'#55405F', textMuted:'#6E5878', textInverse:'#FFFFFF',
  border:'#F0DCD0', borderLight:'#FBEDE4',
  success:'#15803D', error:'#BE123C', warning:'#92620A', info:'#7E22CE',
  gradientPrimary:['#F97316','#A855F7'], gradientSuccess:['#4ADE80','#15803D'],
  gradientWarn:['#FF6B8A','#BE123C'], gradientCard:['#FFFFFF','#FDEDE4'],
  gradientGold:['#FFC46B','#92620A'], gradientDark:['#C2410C','#7E22CE'],
  tabBar:'#FFFFFF', tabBarBorder:'#F0DCD0', statusBar:'dark',
};

// ─── H. AMOLED Pure Black ───────────────────────────────────────────────────

export const AmoledDarkTheme = {
  background:'#000000', surface:'#000000', card:'#0A0A0A', cardAlt:'#141414', cardElevated:'#1C1C1C',
  primary:'#5B9BFF', primaryLight:'#8FBCFF', primaryDark:'#2F6FD0', primarySurface:'#0E1A2B',
  accent:'#22D39A', accentSurface:'#04241A', accentWarn:'#FF6B6B', accentWarnSurface:'#240D0D',
  accentYellow:'#FFC043', accentYellowSurface:'#241B04',
  textPrimary:'#FFFFFF', textSecondary:'#C2C2C2', textMuted:'#A0A0A0', textInverse:'#000000',
  border:'#1F1F1F', borderLight:'#141414',
  success:'#22D39A', error:'#FF6B6B', warning:'#FFC043', info:'#5B9BFF',
  gradientPrimary:['#5B9BFF','#2F6FD0'], gradientSuccess:['#22D39A','#12916A'],
  gradientWarn:['#FF6B6B','#C43B3B'], gradientCard:['#0A0A0A','#000000'],
  gradientGold:['#FFC043','#C58A00'], gradientDark:['#0A0A0A','#000000'],
  tabBar:'#000000', tabBarBorder:'#1F1F1F', statusBar:'light',
};

export const AmoledLightTheme = {
  background:'#FFFFFF', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#F2F2F2', cardElevated:'#E8E8E8',
  primary:'#1D4ED8', primaryLight:'#3B82F6', primaryDark:'#1435A1', primarySurface:'#E6EDFD',
  accent:'#0F7B5A', accentSurface:'#E2F4EE', accentWarn:'#C02626', accentWarnSurface:'#FCE8E8',
  accentYellow:'#7A5600', accentYellowSurface:'#FBF1D9',
  textPrimary:'#000000', textSecondary:'#333333', textMuted:'#565656', textInverse:'#FFFFFF',
  border:'#CFCFCF', borderLight:'#E8E8E8',
  success:'#0F7B5A', error:'#C02626', warning:'#7A5600', info:'#1D4ED8',
  gradientPrimary:['#3B82F6','#1D4ED8'], gradientSuccess:['#22D39A','#0F7B5A'],
  gradientWarn:['#FF6B6B','#C02626'], gradientCard:['#FFFFFF','#F2F2F2'],
  gradientGold:['#FFC043','#7A5600'], gradientDark:['#1D4ED8','#1435A1'],
  tabBar:'#FFFFFF', tabBarBorder:'#CFCFCF', statusBar:'dark',
};

// ─── I. Material You Wallet ─────────────────────────────────────────────────

export const MaterialDarkTheme = {
  background:'#141218', surface:'#1D1B20', card:'#211F26', cardAlt:'#2B2930', cardElevated:'#36343B',
  primary:'#D0BCFF', primaryLight:'#E9DDFF', primaryDark:'#9A82DB', primarySurface:'#4F378B',
  accent:'#6FD99B', accentSurface:'#0C3323', accentWarn:'#F2B8B5', accentWarnSurface:'#3B1513',
  accentYellow:'#E9C46A', accentYellowSurface:'#32280C',
  textPrimary:'#E6E0E9', textSecondary:'#CAC4D0', textMuted:'#A9A2B3', textInverse:'#1D1B20',
  border:'#49454F', borderLight:'#332F38',
  success:'#6FD99B', error:'#F2B8B5', warning:'#E9C46A', info:'#D0BCFF',
  gradientPrimary:['#D0BCFF','#9A82DB'], gradientSuccess:['#6FD99B','#34A06A'],
  gradientWarn:['#F2B8B5','#B85C58'], gradientCard:['#211F26','#1D1B20'],
  gradientGold:['#E9C46A','#B08A1E'], gradientDark:['#211F26','#141218'],
  tabBar:'#1D1B20', tabBarBorder:'#49454F', statusBar:'light',
};

export const MaterialLightTheme = {
  background:'#FEF7FF', surface:'#FFFFFF', card:'#FFFFFF', cardAlt:'#F3EDF7', cardElevated:'#ECE6F0',
  primary:'#6750A4', primaryLight:'#7F67BE', primaryDark:'#4F378B', primarySurface:'#EADDFF',
  accent:'#006D3B', accentSurface:'#DFF5E4', accentWarn:'#B3261E', accentWarnSurface:'#F9DEDC',
  accentYellow:'#7D5700', accentYellowSurface:'#FBF0D9',
  textPrimary:'#1D1B20', textSecondary:'#49454F', textMuted:'#615D68', textInverse:'#FFFFFF',
  border:'#CAC4D0', borderLight:'#E7E0EC',
  success:'#006D3B', error:'#B3261E', warning:'#7D5700', info:'#6750A4',
  gradientPrimary:['#7F67BE','#6750A4'], gradientSuccess:['#4CAF7D','#006D3B'],
  gradientWarn:['#E46962','#B3261E'], gradientCard:['#FFFFFF','#F3EDF7'],
  gradientGold:['#E9C46A','#7D5700'], gradientDark:['#6750A4','#4F378B'],
  tabBar:'#FFFFFF', tabBarBorder:'#CAC4D0', statusBar:'dark',
};

// ─── Registre des palettes ──────────────────────────────────────────────────
// Chaque entree fournit une variante claire et une variante sombre, afin que
// le mode 'auto' reste fonctionnel quelle que soit la palette choisie.

export const Themes = {
  classic:  { id:'classic',  label:'Classique',            icon:'🔷', desc:'Palette d\'origine, bleu nuit',        dark: DarkTheme,         light: LightTheme },
  fintech:  { id:'fintech',  label:'Dark Fintech Premium', icon:'🛡️', desc:'Moderne, sécurisé, orienté fintech',   dark: FintechDarkTheme,  light: FintechLightTheme },
  apple:    { id:'apple',    label:'Apple Minimal',        icon:'🍏', desc:'Très épuré, lisibilité maximale',      dark: AppleDarkTheme,    light: AppleLightTheme },
  luxury:   { id:'luxury',   label:'Neo Banking Luxury',   icon:'👑', desc:'Noir profond et or, haut de gamme',    dark: LuxuryDarkTheme,   light: LuxuryLightTheme },
  cyber:    { id:'cyber',    label:'Cyber Wallet',         icon:'⚡', desc:'Cyan et violet, style futuriste',      dark: CyberDarkTheme,    light: CyberLightTheme },
  midnight: { id:'midnight', label:'Midnight Blue',        icon:'🌙', desc:'Bleu nuit et argent, professionnel',   dark: MidnightDarkTheme, light: MidnightLightTheme },
  emerald:  { id:'emerald',  label:'Emerald Finance',      icon:'🌿', desc:'Vert émeraude, finance durable',       dark: EmeraldDarkTheme,  light: EmeraldLightTheme },
  sunset:   { id:'sunset',   label:'Sunset Gradient',      icon:'🌅', desc:'Orange et violet, jeune et dynamique', dark: SunsetDarkTheme,   light: SunsetLightTheme },
  amoled:   { id:'amoled',   label:'AMOLED Pure Black',    icon:'⬛', desc:'Noir absolu, économie de batterie',    dark: AmoledDarkTheme,   light: AmoledLightTheme },
  material: { id:'material', label:'Material You Wallet',  icon:'🎨', desc:'Material 3, accessibilité soignée',    dark: MaterialDarkTheme, light: MaterialLightTheme },
};

export const DEFAULT_PALETTE_ID = 'classic';

export const getPalette = (paletteId, isDark) =>
  (Themes[paletteId] || Themes[DEFAULT_PALETTE_ID])[isDark ? 'dark' : 'light'];

// Backward compat — screens that import Colors directly still work
export const Colors = DarkTheme;