import styled from 'styled-components'

export const

    Title = styled.h3`
        margin-bottom: 20px;
        font-weight: 400;
        color: #444;
    `,

    InputGroup = styled.div`
        display: flex;
        align-items: stretch;

        width: 100%;

        margin: 20px 0 60px;
    `,

    InputColumn = styled.div`
        box-sizing: border-box;
        position: relative;
        width: 100%;
        padding: 0 5px;
        
        input:not([value=""]) ~ label {
            transform: translateY(-25px) translateX(-6px);
        }

        textarea ~ label {
            transform: translateY(-30px) translateX(-6px);
        }

        textarea {
            box-sizing: border-box;
        
            width: 100%;

            padding: 15px 20px;

            border-radius: 2px;

            outline: none;
            background: transparent;
            color: #222;

            border: 1px solid rgba(0,0,0,.1);
            resize: none;

            transition: 250ms border-color;

            &:focus {
                border-color: rgba(0,0,0,.23)
            }
        }
    `,

    ImageUploadWrapper = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 100px;
    `,

    CircleLoading = styled.img`
        width: 36px;
        height: 36px;
    `,

    Upload = styled.label`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        width: 240px;
        font-size: 14px;
        color: #fff;
        border-radius: 3px;
        background: #607D8B;
        cursor: pointer;
        
        .text {
            margin: 0 6px;
        }
    `,

    ImgContainer = styled.div`
        position: relative;
        width: 200px;
        height: 200px;
        border-radius: 100px;
        overflow: hidden;
        background: rgba(0,0,0,.15);
    `,

    Img = styled.img`
        min-width: 100%;
        min-height: 100%;
    `,

 
    Label = styled.label`
        display: block;
        position: absolute;
        margin-left: 7px;
        top: 3px;
        /* bottom: 10px; */
        font-size: 14px;
        font-weight: 400;
        color: #777;
        transition: 250ms transform;

        &:first-letter {
            text-transform: capitalize;
        }
    `,

    Input = styled.input`
        box-sizing: border-box;
        
        max-width: 100%;
        width: 100%;
        height: auto;

        padding: 0 8px 10px;

        border: none;
        outline: none;
        background: transparent;
        color: #222;

        border-bottom: 1px solid rgba(0,0,0,.1);

        transition: 250ms border-color, 250ms transform;

        &:not([value=""]) {
            border-color: rgba(0,0,0,.15)
        }

        &:focus {
            border-color: rgba(0,0,0,.23)
        }
    `,

    Body = styled.div`
        box-sizing: border-box;
        padding: 20px 0;
        width: 100%;
    `,

    Button = styled.button`
        padding: 10px 24px;
        font-size: 14px;
        border-radius: 3px;
        background: #3D5AFE;
        color: #fff;
        border: none;
        cursor: pointer;
    `