import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Rect, Circle, Polygon, Line } from 'react-native-svg';

interface SvgIconProps {
  name: string; // The name of the SVG file (without .svg extension)
  width?: number;
  height?: number;
  color?: string;
}

// A mapping of icon names to their SVG content (paths, etc.)
// This will be populated dynamically or manually based on your SVG files.
// For now, it's a placeholder.
const IconMap: { [key: string]: React.FC<{ color?: string; size?: number }> } = {
  'Add_Plus': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Edit / Add_Plus">
        <Path id="Vector" d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Award': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="7" />
      <Path d="M12 15v7" />
      <Path d="M10 22H8.5C7.94772 22 7.5 21.5523 7.5 21V19.5C7.5 18.9477 7.94772 18.5 8.5 18.5H15.5C16.0523 18.5 16.5 18.9477 16.5 19.5V21C16.5 21.5523 16.0523 22 15.5 22H14" />
    </Svg>
  ),
  'Bell_Notification': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Communication / Bell_Notification">
        <Path id="Vector" d="M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17.0001M15 17L9 17.0001M15 17H19C19.5523 17 20 16.5523 20 16V15.4141C20 15.1489 19.8945 14.8946 19.707 14.707L19.1963 14.1963C19.0706 14.0706 19 13.9 19 13.7222V10C19 9.82357 18.9936 9.64855 18.9805 9.4761M9 17.0001L5 17.0001C4.44772 17.0001 4 16.5521 4 15.9998V15.4141C4 15.1489 4.10544 14.8949 4.29297 14.7073L4.80371 14.1958C4.92939 14.0701 5 13.9002 5 13.7224V9.99998C5 6.13401 8.134 3 12 3C12.7116 3 13.3984 3.10618 14.0454 3.30357M18.9805 9.4761C20.1868 8.7873 21 7.48861 21 6C21 3.79086 19.2091 2 17 2C15.8298 2 14.7769 2.50253 14.0454 3.30357M18.9805 9.4761C18.3966 9.80949 17.7205 10 17 10C14.7909 10 13 8.20914 13 6C13 4.9611 13.3961 4.0147 14.0454 3.30357M18.9805 9.4761C18.9805 9.47609 18.9805 9.4761 18.9805 9.4761ZM14.0454 3.30357C14.0459 3.30371 14.0464 3.30385 14.0468 3.304" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Book_Open': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Interface / Book_Open">
        <Path id="Vector" d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Brain': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2c-3.3137 0-6 2.6863-6 6 0 2.2091 1.0045 4.1909 2.5858 5.4142C9.5858 14.6255 10 15 10 16v4c0 1.1046 0.8954 2 2 2s2-0.8954 2-2v-4c0-1-0.4142-1.3745-1.4142-2.5858C16.9955 12.1909 18 10.2091 18 8c0-3.3137-2.6863-6-6-6z" />
    </Svg>
  ),
  'Flame': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C12 2 4 5 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 5 12 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  'CameraIcon': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="System / Camera">
        <Path id="Vector" d="M9.48898 7H6.2002C5.08009 7 4.51962 7 4.0918 7.21799C3.71547 7.40973 3.40973 7.71547 3.21799 8.0918C3 8.51962 3 9.08009 3 10.2002V15.8002C3 16.9203 3 17.4796 3.21799 17.9074C3.40973 18.2837 3.71547 18.5905 4.0918 18.7822C4.5192 19 5.07899 19 6.19691 19H17.8031C18.921 19 19.48 19 19.9074 18.7822C20.2837 18.5905 20.5905 18.2837 20.7822 17.9074C21 17.48 21 16.921 21 15.8031V10.1969C21 9.07899 21 8.5192 20.7822 8.0918C20.5905 7.71547 20.2837 7.40973 19.9074 7.21799C19.4796 7 18.9203 7 17.8002 7H14.5108M9.48898 7H9.55078M9.48898 7C9.50151 7.00001 9.51468 7 9.52857 7L9.55078 7M9.48898 7C9.38286 6.99995 9.32339 6.99941 9.27637 6.99414C8.68878 6.92835 8.28578 6.36908 8.40918 5.79084C8.42066 5.73703 8.44336 5.66894 8.4883 5.53412L8.49023 5.52841C8.54156 5.37443 8.56723 5.29743 8.59558 5.22949C8.88586 4.53389 9.54322 4.06083 10.2949 4.00541C10.3683 4 10.449 4 10.6113 4H13.3886C13.5509 4 13.6322 4 13.7057 4.00541C14.4574 4.06083 15.114 4.53389 15.4043 5.22949C15.4326 5.29743 15.4584 5.37434 15.5098 5.52832C15.556 5.66699 15.5791 5.73636 15.5908 5.79093C15.7142 6.36917 15.3118 6.92835 14.7242 6.99414C14.6772 6.99941 14.6171 6.99995 14.5108 7M9.55078 7H14.449M14.449 7H14.5108M14.449 7L14.4712 7C14.4851 7 14.4983 7.00001 14.5108 7M12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Chevron_Down': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Arrow / Chevron_Down">
        <Path id="Vector" d="M19 9L12 16L5 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Chevron_Right': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Arrow / Chevron_Right">
        <Path id="Vector" d="M9 5L16 12L9 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Circle_Check': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Warning / Circle_Check">
        <Path id="Vector" d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Circle_Help': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Warning / Circle_Help">
        <Path id="Vector" d="M9.14648 9.07361C9.31728 8.54732 9.63015 8.07896 10.0508 7.71948C10.4714 7.36001 10.9838 7.12378 11.5303 7.03708C12.0768 6.95038 12.6362 7.0164 13.1475 7.22803C13.6587 7.43966 14.1014 7.78875 14.4268 8.23633C14.7521 8.68391 14.9469 9.21256 14.9904 9.76416C15.0339 10.3158 14.9238 10.8688 14.6727 11.3618C14.4215 11.8548 14.0394 12.2685 13.5676 12.5576C13.0958 12.8467 12.5533 12.9998 12 12.9998V14.0002M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 17V17.1L11.9502 17.1002V17H12.0498Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Clock': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Time / Clock">
        <Path id="Vector" d="M12 8V12L14 14M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
  'Close_SM': ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="Menu / Close_SM">
        <Path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
    </Svg>
  ),
};