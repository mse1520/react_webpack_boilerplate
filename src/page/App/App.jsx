import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body {
    background-color: rgb(30, 30, 30);
    margin: 0;
    -webkit-user-select: none;
}`;

export default () => {
    return <>
        <h1>테스트</h1>
        <GlobalStyle />
    </>;
};