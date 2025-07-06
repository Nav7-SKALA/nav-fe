import { createGlobalStyle } from 'styled-components';
import PretendardRegular from './assets/fonts/Pretendard-Regular.woff';
import PretendardMedium from './assets/fonts/Pretendard-Medium.woff';
import PretendardBold from './assets/fonts/Pretendard-Bold.woff';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url(${PretendardRegular}) format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Pretendard';
    src: url(${PretendardMedium}) format('woff');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Pretendard';
    src: url(${PretendardBold}) format('woff');
    font-weight: 700;
    font-style: normal;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    // background-color: #fff;
    // color: #000;
  }
`;

export default GlobalStyle;
