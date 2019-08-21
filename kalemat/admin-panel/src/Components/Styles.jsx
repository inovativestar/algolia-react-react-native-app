import styled from 'styled-components'

// export const Button = styled.button`
//     width: 100%;
//     padding: 8px;

//     border: none;
//     background: #4C84FF;
//     color: #fff;

//     cursor: pointer;
//     outline: none;
// `

export const Button = styled.button`
    padding: 16px 0;

    width: 140px;

    border: none;
    border-radius: 6px;

    font-size: 1rem;
    font-weight: 400;

    color: ${props => props.primary ? '#fff' : '#616161'};
    background: ${props => props.primary ? '#3D5AFE' : '#fff'};
    box-shadow: 0 10px 10px -8px rgba(0,0,0,.05);

    outline: none;
    cursor: pointer;

    transition: color 150ms ease-in-out,
                box-shadow 150ms ease-in-out,
                transform 150ms ease-in-out;

    will-change: transform;

    &:active {
        color: ${props => props.primary ? '' : '#424242'};
        box-shadow: 0 10px 20px -8px rgba(0,0,0,.17);
        transform: translateY(-2px);
    }

    .exclamation-circle {
        position: absolute;
        
        top: 10px;
        right: 10px;
        
        /* font-size: 20px; */
        color: #F44336;
    }
`