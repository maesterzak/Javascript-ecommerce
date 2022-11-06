
import styled, {css} from 'styled-components';

export const UiButton = styled.button`
  

  ${props =>
    props.cart && css
    `
    display: flex;
    justify-content:center;
    align-items: center;
    padding: 16px 32px;
    border-color: transparent;
    margin-top: 10px;
    width: 279px;
    height: 43px;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    color: #FFFFFF;
    background: #5ECE7B;
    cursor:pointer;
    font-family:'Raleway';
    `
    }
    
    

`;






